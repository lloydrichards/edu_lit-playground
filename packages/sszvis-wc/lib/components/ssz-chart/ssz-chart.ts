import {
  ScaleLinear,
  scaleLinear,
  ScaleOrdinal,
  ScaleTime,
  scaleTime,
} from "d3";
import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { consume, createContext, provide } from "@lit/context";
import { Bounds } from "../../types/domain";
import {
  dataLoaderContext,
  DataLoaderContext,
} from "../ssz-data-loader/ssz-data-loader";

const TwLitElement = TW(LitElement, sszvisStylesheet);

export type ScaleContext = {
  x: ScaleTime<number, number, never>;
  y: ScaleLinear<number, number, never>;
  c: ScaleOrdinal<string, string, never>;
};

export const chartLayerContext = createContext<any>(Symbol("chartLayerKey"));
export const scaleContext = createContext<ScaleContext>(Symbol("scaleKey"));
export const boundsContext = createContext<Bounds>(Symbol("boundsKey"));

@customElement("ssz-chart")
export class SSZChart extends TwLitElement {
  @property({ type: String }) title = "";
  @property({ type: String }) description = "";

  @property({ type: Object, reflect: true }) margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = { top: 60, right: 20, bottom: 50, left: 20 };

  @consume({ context: dataLoaderContext, subscribe: true })
  dataLoader: DataLoaderContext = {} as DataLoaderContext;

  @provide({ context: chartLayerContext }) chartLayer!: any;
  @provide({ context: scaleContext }) scale: ScaleContext = {} as ScaleContext;
  @provide({ context: boundsContext }) bounds!: Bounds;

  @query("#sszvis-chart") root!: HTMLDivElement;

  private createChart() {
    if (!this.dataLoader.data) return;
    this.bounds = sszvis.bounds({ ...this.margin }, this.root);

    this.chartLayer = sszvis
      .createSvgLayer(this.root, this.bounds, {
        title: this.title,
        description: this.description,
      })
      .datum(this.dataLoader.data);

    // Scales
    this.scale.x = scaleTime()
      .domain(this.dataLoader.xRange.map((d) => new Date(d)))
      .range([0, this.bounds.innerWidth]);

    this.scale.y = scaleLinear()
      .domain(this.dataLoader.yRange)
      .range([this.bounds.innerHeight, 0]);

    this.scale.c = (
      this.dataLoader.categorySet.size > 6
        ? sszvis.scaleQual12()
        : sszvis.scaleQual6()
    ).domain(this.dataLoader.categorySet);

    sszvis.viewport.on("resize", () => {
      this.requestUpdate();
    });
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    this.createChart();
  }

  render() {
    if (!this.dataLoader.data) return html`<div>Loading...</div>`;
    return html`
      <div id="sszvis-chart" class="border border-red-300">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ssz-chart": SSZChart;
  }
}
