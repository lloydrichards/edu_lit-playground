import { LitElement, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../../shared/tailwindMixin";

import { consume } from "@lit/context";
import { Datum, SSZSelection } from "../../../types/domain";
import {
  geomLayerContext,
  ScaleContext,
  scaleContext
} from "../ssz-chart";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("line-geom")
export class LineGeom extends TwLitElement {
  private xAcc = (d: Datum) => new Date(d.xValue);
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  @consume({ context: geomLayerContext, subscribe: true })
  geomLayer!: SSZSelection;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;

  generateLines() {
    if (!this.geomLayer) return;

    // Components
    const line = sszvis
      .line()
      .x(sszvis.compose(this.scale.x, this.xAcc))
      .y(sszvis.compose(this.scale.y, this.yAcc))
      .transition(undefined)
      .stroke(sszvis.compose(this.scale.c, this.cAcc, sszvis.first));

    this.geomLayer.selectGroup("line").call(line);
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    this.generateLines();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "line-geom": LineGeom;
  }
}
