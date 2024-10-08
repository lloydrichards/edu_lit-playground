import { Task } from "@lit/task";
import { ascending, csv, extent, max } from "d3";
import { html, LitElement } from "lit";
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { Datum } from "./utils";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("sszvis-data-loader")
export class SSZVISDataLoader extends TwLitElement {
  @property({ type: String }) dataSrc = "";
  @property({ type: String }) xCol = "";
  @property({ type: String }) yCol = "";
  @property({ type: String }) cCol = "";

  @state() data: Array<Datum[]> = [];
  @state() xRange: [Date, Date] = [new Date(), new Date()];
  @state() yRange: [number, number] = [0, 0];
  @state() categorySet: Set<string> = new Set();

  private xAcc = (d: Datum) => d.xValue;
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  @queryAssignedElements({ slot: "chart" }) _chart!: Array<HTMLElement>;
  @queryAssignedElements({ slot: "legend" }) _legend!: Array<HTMLElement>;

  private _prepareState = new Task(this, {
    task: async ([dataSrc]) => {
      const data = await csv(dataSrc, (d) => ({
        xValue: sszvis.parseYear(d[this.xCol]),
        yValue: sszvis.parseNumber(d[this.yCol]),
        category: d[this.cCol],
      }));
      this.data = sszvis.cascade().arrayBy(this.cAcc, ascending).apply(data);
      this.xRange = extent(data, this.xAcc) as [Date, Date];
      this.yRange = [0, max(data, this.yAcc) ?? 5000];
      this.categorySet = sszvis.set(data, this.cAcc);
    },
    args: () => [this.dataSrc],
  });

  updated() {
    this._chart.forEach((chart) => {
      chart.setAttribute("data", JSON.stringify(this.data));
      chart.setAttribute("xRange", JSON.stringify(this.xRange));
      chart.setAttribute("yRange", JSON.stringify(this.yRange));
      chart.setAttribute(
        "categorySet",
        JSON.stringify(Array.from(this.categorySet))
      );
    });
    this._legend.forEach((legend) => {
      legend.setAttribute("categorySet", JSON.stringify(this.categorySet));
    });
  }

  render() {
    return this._prepareState.render({
      pending: () => html`<p>Loading csv data...</p>`,
      complete: () => {
        return html`<div>
          <slot name="chart"></slot>
          <slot name="legend"></slot>
        </div>`;
      },
      error: (e) => html`<p>Error: ${e}</p>`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sszvis-data-loader": SSZVISDataLoader;
  }
}
