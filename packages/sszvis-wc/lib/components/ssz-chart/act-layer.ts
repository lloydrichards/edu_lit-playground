import { html, LitElement, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { consume, createContext, provide } from "@lit/context";
import { Datum } from "../../types/domain";
import {
  dataLoaderContext,
  DataLoaderContext,
} from "../ssz-data-loader/ssz-data-loader";
import { chartLayerContext, ScaleContext, scaleContext } from "./ssz-chart";
import { closestDatum } from "./utils";

const TwLitElement = TW(LitElement, sszvisStylesheet);

export const selectedContext = createContext<Datum[]>(Symbol("selectedKey"));
export const onDateChangeContext = createContext<Function>("onDateChangeKey");

@customElement("act-layer")
export class ActLayer extends TwLitElement {
  @provide({ context: selectedContext }) selection = [];
  @provide({ context: onDateChangeContext }) onDateChange = (
    _e: MouseEvent | null,
    inputDate: Date
  ) => {
    var closestDate = this.xAcc(
      closestDatum(
        this.dataLoader.data.flatMap((d) => d),
        this.xAcc,
        inputDate
      )
    );
    var closestData = this.dataLoader.data.map((linePoints) => {
      return sszvis.find((d: Datum) => {
        return this.xAcc(d).toString() === closestDate.toString();
      }, linePoints);
    });
    this.selection = closestData.filter(
      sszvis.compose(sszvis.not(isNaN), this.yAcc)
    );
  };

  @consume({ context: dataLoaderContext, subscribe: true })
  dataLoader!: DataLoaderContext;

  @consume({ context: chartLayerContext, subscribe: true }) chartLayer!: any;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;

  private xAcc = (d: Datum) => new Date(d.xValue);
  private yAcc = (d: Datum) => d.yValue;

  private resetDate = () => {
    var mostRecentDate = new Date(this.scale.x.domain()[1]);
    this.onDateChange(null, mostRecentDate);
  };

  generateInteractions() {
    if (!this.chartLayer) return;
    // Interaction
    var interactionLayer = sszvis
      .move()
      .xScale(this.scale.x)
      .yScale(this.scale.y)
      .on("move", this.onDateChange)
      .on("end", this.resetDate);

    this.chartLayer.selectGroup("interaction").call(interactionLayer);
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    this.generateInteractions();
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "act-layer": ActLayer;
  }
}
