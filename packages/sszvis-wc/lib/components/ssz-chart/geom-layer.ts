import { LitElement, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { consume } from "@lit/context";
import { Datum } from "../../types/domain";
import { chartLayerContext, ScaleContext, scaleContext } from "./ssz-chart";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("geom-layer")
export class GEOMLayer extends TwLitElement {
  private xAcc = (d: Datum) => new Date(d.xValue);
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  @consume({ context: chartLayerContext, subscribe: true }) chartLayer!: any;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;

  generateLines() {
    if (!this.chartLayer) return;

    // Components
    const line = sszvis
      .line()
      .x(sszvis.compose(this.scale.x, this.xAcc))
      .y(sszvis.compose(this.scale.y, this.yAcc))
      .transition(undefined)
      // Access the first data point of the line to decide on the stroke color
      .stroke(sszvis.compose(this.scale.c, this.cAcc, sszvis.first));

    this.chartLayer.selectGroup("line").call(line);
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    this.generateLines();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "geom-layer": GEOMLayer;
  }
}
