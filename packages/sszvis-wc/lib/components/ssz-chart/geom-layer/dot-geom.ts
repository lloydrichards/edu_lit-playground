import { LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../../shared/tailwindMixin";

import { consume } from "@lit/context";
import { Datum, SSZSelection } from "../../../types/domain";
import { geomLayerContext, ScaleContext, scaleContext } from "../ssz-chart";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("dot-geom")
export class DotGeom extends TwLitElement {
  @property({ type: Number }) radius = 4;

  private xAcc = (d: Datum) => new Date(d.xValue);
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  @consume({ context: geomLayerContext, subscribe: true })
  geomLayer!: SSZSelection;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;

  generateLines() {
    if (!this.geomLayer) return;

    // Components
    const dots = sszvis
      .dot()
      .x(sszvis.compose(this.scale.x, this.xAcc))
      .y(sszvis.compose(this.scale.y, this.yAcc))
      .radius(this.radius)
      .fill(sszvis.compose(this.scale.c, this.cAcc))
      // use white outlines in scatterplots to assist in identifying distinct circles
      .stroke("#FFFFFF");

    const dotLayer = this.geomLayer;

    dotLayer
      .datum((d: Datum[]) => d.flat())
      .selectGroup("dots")
      .call(dots);
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    this.generateLines();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dot-geom": DotGeom;
  }
}
