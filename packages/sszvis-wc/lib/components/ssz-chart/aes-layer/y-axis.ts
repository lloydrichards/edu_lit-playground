import { LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../../shared/tailwindMixin";

import { consume } from "@lit/context";
import { Bounds, SSZSelection } from "../../../types/domain";
import {
  aesLayerContext,
  boundsContext,
  ScaleContext,
  scaleContext,
} from "../ssz-chart";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("ssz-y-axis")
export class SSZYAxis extends TwLitElement {
  @property({ type: String }) label = "";
  @property({ type: Number }) ticks = 10;
  @property({ type: String }) orientation: "left" | "right" = "right";
  @property({ type: Boolean }) noGuides = false;

  @consume({ context: aesLayerContext, subscribe: true })
  aesLayer!: SSZSelection;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;
  @consume({ context: boundsContext, subscribe: true })
  @state()
  bounds!: Bounds;

  generateAxes() {
    var yAxis = sszvis
      .axisY()
      .scale(this.scale.y)
      .orient(this.orientation)
      .contour(true)
      .tickLength(this.noGuides ? 0 : this.bounds.innerWidth)
      .title(this.label)
      .dyTitle(-20);

    this.aesLayer
      .selectGroup("yAxis")
      .attr(
        "transform",
        this.orientation == "right"
          ? sszvis.translateString(0, 0)
          : sszvis.translateString(this.bounds.innerWidth, 0)
      )
      .call(yAxis);
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
    "ssz-y-axis": SSZYAxis;
  }
}
