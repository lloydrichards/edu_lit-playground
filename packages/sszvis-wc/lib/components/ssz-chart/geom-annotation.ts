import { LitElement, PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { consume } from "@lit/context";
import { Bounds, Datum } from "../../types/domain";
import { selectedContext } from "./act-layer";
import {
  boundsContext,
  chartLayerContext,
  ScaleContext,
  scaleContext,
} from "./ssz-chart";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("geom-annotation")
export class GeomAnnotation extends TwLitElement {
  @consume({ context: selectedContext, subscribe: true })
  selection!: Datum[];

  @consume({ context: chartLayerContext, subscribe: true }) chartLayer!: any;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;
  @consume({ context: boundsContext, subscribe: true })
  @state()
  bounds!: Bounds;

  private xAcc = (d: Datum) => new Date(d.xValue);
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  generateRulerLines() {
    if (!this.chartLayer) return;

    var rulerLabel = sszvis
      .modularTextSVG()
      .bold((d: Datum) =>
        this.yAcc(d) ? sszvis.formatNumber(this.yAcc(d)) : ""
      )
      .plain((d: Datum) => {
        if (this.yAcc(d) === null) return "";
        return this.cAcc(d).replace("e Wohnbevölkerung", "").toLowerCase();
      });

    var highlightLayer = sszvis
      .annotationRuler()
      .top(0)
      .bottom(this.bounds.innerHeight)
      .x(sszvis.compose(this.scale.x, this.xAcc))
      .y(sszvis.compose(this.scale.y, this.yAcc))
      .label(rulerLabel)
      .flip((d: Datum) => {
        return this.scale.x(this.xAcc(d)) >= this.bounds.innerWidth / 2;
      })
      .color(sszvis.compose(this.scale.c, this.cAcc));

    this.chartLayer
      .selectGroup("highlight")
      .datum(this.selection)
      .call(highlightLayer);
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    this.generateRulerLines();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "geom-annotation": GeomAnnotation;
  }
}
