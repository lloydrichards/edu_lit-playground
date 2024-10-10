import { createContext, provide } from "@lit/context";
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
import { Datum } from "../../types/domain";

const TwLitElement = TW(LitElement, sszvisStylesheet);

export type DataLoaderContext = {
  data: Array<Datum[]>;
  xRange: [Date, Date];
  yRange: [number, number];
  categorySet: Set<string>;
};

export const dataLoaderContext = createContext<DataLoaderContext>(
  Symbol("dataContextKey")
);

@customElement("ssz-data-loader")
export class SSZDataLoader extends TwLitElement {
  @property({ type: String }) dataSrc = "";
  @property({ type: String }) xCol = "";
  @property({ type: String }) yCol = "";
  @property({ type: String }) cCol = "";

  @provide({ context: dataLoaderContext }) @state() context =
    {} as DataLoaderContext;

  private xAcc = (d: Datum) => d.xValue;
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  @queryAssignedElements({ slot: "chart" }) _chart!: Array<HTMLElement>;
  @queryAssignedElements({ slot: "legend" }) _legend!: Array<HTMLElement>;

  private _prepareState = new Task(this, {
    task: async ([dataSrc]) => {
      const rawData = await csv(dataSrc, (d) => ({
        xValue: sszvis.parseYear(d[this.xCol]),
        yValue: sszvis.parseNumber(d[this.yCol]),
        category: d[this.cCol],
      }));
      const data = sszvis
        .cascade()
        .arrayBy(this.cAcc, ascending)
        .apply(rawData);
      const xRange = extent(rawData, this.xAcc) as [Date, Date];
      const yRange = [0, max(rawData, this.yAcc) ?? 5000] as [number, number];
      const categorySet = sszvis.set(rawData, this.cAcc);

      return { data, xRange, yRange, categorySet };
    },
    args: () => [this.dataSrc],
  });

  render() {
    return this._prepareState.render({
      pending: () => html`<p>Loading csv data...</p>`,
      complete: (context) => {
        this.context = context;
        return html`<div>
          <slot name="chart"></slot>
        </div>`;
      },
      error: (e) => html`<p>Error: ${e}</p>`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ssz-data-loader": SSZDataLoader;
  }
}
