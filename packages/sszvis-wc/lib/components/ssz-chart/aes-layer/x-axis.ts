import { LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../../shared/tailwindMixin";

import { consume } from "@lit/context";
import { Bounds, Datum, SSZSelection } from "../../../types/domain";
import { selectedContext } from "../act-layer";
import {
  aesLayerContext,
  boundsContext,
  ScaleContext,
  scaleContext,
} from "../ssz-chart";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("ssz-x-axis")
export class SSZXAxis extends TwLitElement {
  @property({ type: String }) label = "";
  @property({ type: Number }) ticks = 10;
  @property({ type: String }) orientation: "top" | "bottom" = "bottom";

  @consume({ context: selectedContext, subscribe: true })
  selection: Datum[] = [];

  @consume({ context: aesLayerContext, subscribe: true })
  aesLayer!: SSZSelection;
  @consume({ context: scaleContext, subscribe: true }) scale!: ScaleContext;
  @consume({ context: boundsContext, subscribe: true })
  @state()
  bounds!: Bounds;

  private xAcc = (d: Datum) => new Date(d.xValue);

  private isSelected(d: Datum) {
    if (!this.selection) return false;
    console.log("selection", this.selection);
    return sszvis.contains(
      this.selection.map(this.xAcc).map(String),
      String(d)
    );
  }

  generateAxes() {
    var xTickValues = this.scale.x
      .ticks(this.ticks)
      .concat(this.selection.map(this.xAcc));

    var xAxis = sszvis.axisX
      .time()
      .scale(this.scale.x)
      .orient(this.orientation)
      .tickValues(xTickValues)
      .alignOuterLabels(true)
      .highlightTick(this.isSelected)
      .title(this.label);

    this.aesLayer
      .selectGroup("xAxis")
      .attr(
        "transform",
        this.orientation == "bottom"
          ? sszvis.translateString(0, this.bounds.innerHeight)
          : sszvis.translateString(0, 0)
      )
      .call(xAxis);
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    this.generateAxes();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ssz-x-axis": SSZXAxis;
  }
}
