import { LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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

@customElement("aes-layer")
export class AESLayer extends TwLitElement {
  @property({ type: String }) yLabel = "";
  @property({ type: String }) xLabel = "";
  @property({ type: Number }) ticks = 10;

  @consume({ context: selectedContext, subscribe: true })
  selection: Datum[] = [];

  @consume({ context: chartLayerContext, subscribe: true }) chartLayer!: any;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;
  @consume({ context: boundsContext, subscribe: true })
  @state()
  bounds!: Bounds;

  private xAcc = (d: Datum) => new Date(d.xValue);

  private isSelected(d: Datum) {
    if (!this.selection) return false;
    return sszvis.contains(
      this.selection.map(this.xAcc).map(String),
      String(d)
    );
  }

  generateAxes() {
    var xTickValues = this.scale.x.ticks(this.ticks);

    var xAxis = sszvis.axisX
      .time()
      .scale(this.scale.x)
      .orient("bottom")
      .tickValues(xTickValues)
      .alignOuterLabels(true)
      .highlightTick(this.isSelected)
      .title(this.xLabel);

    var yAxis = sszvis
      .axisY()
      .scale(this.scale.y)
      .orient("right")
      .contour(true)
      .tickLength(this.bounds.innerWidth)
      .title(this.yLabel)
      .dyTitle(-20);

    this.chartLayer
      .selectGroup("xAxis")
      .attr("transform", sszvis.translateString(0, this.bounds.innerHeight))
      .call(xAxis);

    this.chartLayer.selectGroup("yAxis").call(yAxis);
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (changedProperties.has("bounds")) {
      this.generateAxes();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "aes-layer": AESLayer;
  }
}
