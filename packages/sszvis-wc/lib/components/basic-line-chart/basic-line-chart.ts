import { html, LitElement, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { ResizeController } from "@lit-labs/observers/resize-controller.js";
import { Task } from "@lit/task";
import { ascending, csv, extent, line, max, scaleLinear, scaleTime } from "d3";
import * as sszvis from "sszvis";
import { TW } from "../../shared/tailwindMixin";

const TwLitElement = TW(LitElement);

export interface Datum {
  xValue: Date;
  yValue: number;
  category: string;
}

@customElement("basic-line-chart")
export class BasicLineChart extends TwLitElement {
  @property({ type: String }) dataSrc = "";
  @property({ type: String }) title = "";
  @property({ type: String }) description = "";
  @property({ type: String }) xCol = "";
  @property({ type: String }) yCol = "";
  @property({ type: String }) cCol = "";
  @property({ type: String }) yLabel = "";
  @property({ type: String }) xLabel = "";
  @property({ type: Number }) ticks = 10;

  @property({ type: Object, reflect: true }) padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = { top: 20, right: 20, bottom: 20, left: 20 };

  @state() _lineData: Array<Datum[]> = [];
  @state() xRange: [Date, Date] = [new Date(), new Date()];
  @state() yRange: [number, number] = [0, 0];
  @state() categorySet: Set<string> = new Set();

  private xAcc = (d: Datum) => d.xValue;
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  private xScale = scaleTime();
  private yScale = scaleLinear();
  private cScale = sszvis.scaleQual12();

  private _prepareState = new Task(this, {
    task: async ([dataSrc]) => {
      const data = await csv(dataSrc, (d) => ({
        xValue: sszvis.parseYear(d[this.xCol]),
        yValue: sszvis.parseNumber(d[this.yCol]),
        category: d[this.cCol],
      }));
      this._lineData = sszvis
        .cascade()
        .arrayBy(this.cAcc, ascending)
        .apply(data);
      this.xRange = extent(data, this.xAcc) as [Date, Date];
      this.yRange = [0, max(data, this.yAcc) ?? 5000];
      this.categorySet = sszvis.set(data, this.cAcc);
    },
    args: () => [this.dataSrc],
  });

  private _resizeController = new ResizeController<DOMRectReadOnly>(this, {
    callback: (entries) => entries[entries.length - 1]?.contentRect,
  });

  private generateXAxis = (height: number, width: number) => {
    return svg`
        <g class="axis axis-x" 
         transform="translate(0,${height})"
        >
        <line x2="${width}" class="stroke-current"></line>
          <text class="fill-current" x="${width / 2}" y="${this.padding.bottom + 16}" text-anchor="middle">${this.xLabel}</text>
          ${this.xScale.ticks(this.ticks).map((d) => {
            return svg`
              <g class="tick" transform="translate(${this.xScale(d)},0)">
                <line y2="6" class="stroke-current"></line>
                <text y="9" dy=".71em" font-size="12" class="fill-current" text-anchor="middle">${sszvis.formatYear(d)}</text>
              </g>
            `;
          })}
        </g>
      `;
  };

  private generateYAxis = (height: number) => {
    return svg`
        <g class="axis axis-y">
          <line y2="${height}" class="stroke-current"></line>
          <text class="fill-current" x=${-this.padding.left} y="${height / 2}" text-anchor="middle" transform="rotate(-90 ${-this.padding.left} ${height / 2})">${this.yLabel}</text>
          ${this.yScale.ticks().map((d) => {
            return svg`
              <g class="tick" transform="translate(0,${this.yScale(d)})">
                <line x2="-6" class="stroke-current"></line>
                <text x="-9" y="3" dy=".32em" font-size="12" class="fill-current" text-anchor="end">${sszvis.formatNumber(d)}</text>
              </g>
            `;
          })}
        </g>
      `;
  };

  render() {
    const width = this._resizeController.value?.width ?? 0;
    const height = this._resizeController.value?.height ?? 0;

    const innerWidth = width - this.padding.left - this.padding.right;
    const innerHeight = height - this.padding.top - this.padding.bottom;

    this.xScale.domain(this.xRange).range([0, innerWidth]);
    this.yScale.domain(this.yRange).range([innerHeight, 0]);
    this.cScale = (
      this.categorySet.size > 6 ? sszvis.scaleQual12() : sszvis.scaleQual6()
    ).domain(this.categorySet);

    var lineGen = line<Datum>()
      .x((d) => this.xScale(this.xAcc(d)))
      .y((d) => this.yScale(this.yAcc(d)))
      .defined((d) => this.yAcc(d) !== null);

    return this._prepareState.render({
      // TODO: create a web component for initial, pending and error states
      pending: () => html`<p>Loading product...</p>`,
      complete: () => html`
        <div class="w-full h-[300px]">
          <svg width="${width}" height="${height}" class="overflow-visible">
            <g transform="translate(${this.padding.left},${this.padding.top})">
              ${this.generateXAxis(innerHeight, innerWidth)}
              ${this.generateYAxis(innerHeight)}
              ${this._lineData.map((d: Datum[]) => {
                return svg`
                <path
                  d=${lineGen(d) ?? ""}
                  fill="none"
                  stroke=${this.cScale(d[0].category)}
                  stroke-width="2"
                ></path>
              `;
              })}
            </g>
          </svg>
        </div>
      `,
      error: (e) => html`<p>Error: ${e}</p>`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "basic-line-chart": BasicLineChart;
  }
}
