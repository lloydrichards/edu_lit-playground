import { html, LitElement, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import * as React from "react";
import { TW } from "../shared/tailwindMixin";
import { createComponent } from "@lit/react";
import { ResizeController } from "@lit-labs/observers/resize-controller.js";
import { scaleBand, scaleLinear } from "d3-scale";
import { cn } from "lib/lib/utils";

const TwLitElement = TW(LitElement);

type Datum = {
  category: string;
  value: number;
};

@customElement("bar-chart")
export class BarChart extends TwLitElement {
  @state() private _innerWidth = 0;
  @state() private _innerHeight = 0;

  private padding = {
    top: 10,
    right: 10,
    bottom: 48,
    left: 28,
  };

  @property({ type: Array }) data: Array<Datum> = [];
  @property({ attribute: false }) hoveredIndex: number | null = null;

  getXScale() {
    return scaleBand()
      .domain(this.data.map((d) => d.category))
      .range([0, this._innerWidth])
      .padding(0.1);
  }

  getYScale() {
    return scaleLinear()
      .domain([0, Math.max(...this.data.map((d) => d.value))])
      .range([0, this._innerHeight]);
  }

  private _resizeController = new ResizeController<DOMRectReadOnly>(this, {
    callback: (entry) => entry[entry.length - 1].contentRect,
  });

  render() {
    const width = this._resizeController.value?.width ?? 0;
    const height = this._resizeController.value?.height ?? 0;
    this._innerWidth = width - this.padding.left - this.padding.right;
    this._innerHeight = height - this.padding.top - this.padding.bottom;

    const xScale = this.getXScale();
    const yScale = this.getYScale();

    return html`
      <div class="w-[90vw] h-[20rem]">
        <svg width="${width}" height="${height}" class="">
          <g transform="translate(${this.padding.left}, ${this.padding.top})">
            <g>
              ${this.data.map((d, i) => {
                return svg`<rect
              x="${xScale(d.category) ?? 0}"
              y="${this._innerHeight - yScale(d.value)}"
              width="${xScale.bandwidth()}"
              height="${yScale(d.value)}"
              class="${cn("fill-primary transition-opacity duration-500", this.hoveredIndex === i && "brightness-125")}"
              @mouseover=${() => this.onHoverHandler(i)}
              @mouseleave=${() => this.onHoverHandler(null)}
            ></rect>`;
              })}
            </g>
            <g>
              ${xScale.domain().map((category) => {
                return svg`<text
                x="${(xScale(category) ?? 0) + xScale.bandwidth() / 2}"
                y="${this._innerHeight + 18}"
                class="text-xs fill-primary-foreground"
                text-anchor="middle"
              >
                ${category}
              </text>`;
              })}
              <line
                x1="0"
                y1="${this._innerHeight}"
                x2="${this._innerWidth}"
                y2="${this._innerHeight}"
                class="stroke-primary-foreground"
              ></line>
            </g>
            <g>
              ${yScale.ticks().map((tick) => {
                return svg`<text
                x="-8"
                y="${this._innerHeight - yScale(tick)}"
                class="text-xs fill-primary-foreground"
                text-anchor="end"
                dy="0.32em"
              >
                ${tick}
              </text>`;
              })}
              ${yScale.ticks().map((tick) => {
                return svg`<line
                x1="-4"
                y1="${this._innerHeight - yScale(tick)}"
                x2="0"
                y2="${this._innerHeight - yScale(tick)}"
                class="stroke-primary-foreground"
              ></line>`;
              })}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="${this._innerHeight}"
                class="stroke-primary-foreground"
              ></line>
            </g>
          </g>
        </svg>
      </div>
    `;
  }

  private onHoverHandler(i: number | null) {
    this.hoveredIndex = i;
  }
}

export const BarChartReact = createComponent({
  react: React,
  tagName: "bar-chart",
  elementClass: BarChart,
  displayName: "BarChart",
});

declare global {
  interface HTMLElementTagNameMap {
    "bar-chart": BarChart;
  }
}
