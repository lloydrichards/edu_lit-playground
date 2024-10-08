import { scaleLinear, scaleTime } from "d3";
import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { closestDatum, Datum } from "./utils";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("sszvis-line-chart-2")
export class SSZVISLineChart2 extends TwLitElement {
  @property({ type: String }) title = "";
  @property({ type: String }) description = "";
  @property({ type: String }) yLabel = "";
  @property({ type: String }) xLabel = "";
  @property({ type: Number }) ticks = 10;

  @property({ type: Object, reflect: true }) margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = { top: 60, right: 20, bottom: 50, left: 20 };

  @property({ type: Array }) data: Array<Datum[]> = [];
  @property({ type: Array }) xRange: [Date, Date] = [new Date(), new Date()];
  @property({ type: Array }) yRange: [number, number] = [0, 0];
  @property({ type: Object }) categorySet: Set<string> = new Set();

  @state() selection: Datum[] = [];

  private xAcc = (d: Datum) => new Date(d.xValue);
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  private isSelected(d: Datum) {
    if (!this.selection) return false;
    return sszvis.contains(
      this.selection.map(this.xAcc).map(String),
      String(d)
    );
  }

  private changeDate(_e: MouseEvent | null, inputDate: Date) {
    var closestDate = this.xAcc(
      closestDatum(
        this.data.flatMap((d) => d),
        this.xAcc,
        inputDate
      )
    );
    var closestData = this.data.map((linePoints) => {
      return sszvis.find((d: Datum) => {
        return this.xAcc(d).toString() === closestDate.toString();
      }, linePoints);
    });
    this.selection = closestData.filter(
      sszvis.compose(sszvis.not(isNaN), this.yAcc)
    );
  }

  private resetDate() {
    var mostRecentDate = new Date(this.xRange[1]);
    this.changeDate(null, mostRecentDate);
  }

  private createChart() {
    var bounds = sszvis.bounds(
      { ...this.margin },
      this.shadowRoot?.querySelector("#sszvis-chart")
    );

    // Scales
    var xScale = scaleTime()
      .domain(this.xRange.map((d) => new Date(d)))
      .range([0, bounds.innerWidth]);

    var yScale = scaleLinear()
      .domain(this.yRange)
      .range([bounds.innerHeight, 0]);

    var cScale =
      this.categorySet.size > 6 ? sszvis.scaleQual12() : sszvis.scaleQual6();
    cScale.domain(this.categorySet);

    // Layers
    var chartLayer = sszvis
      .createSvgLayer(this.shadowRoot?.querySelector("#sszvis-chart"), bounds, {
        title: this.title,
        description: this.description,
      })
      .datum(this.data);

    // Components
    const line = sszvis
      .line()
      .x(sszvis.compose(xScale, this.xAcc))
      .y(sszvis.compose(yScale, this.yAcc))
      .transition(undefined)
      // Access the first data point of the line to decide on the stroke color
      .stroke(sszvis.compose(cScale, this.cAcc, sszvis.first));

    // Add the highlighted data as additional ticks to the xScale
    // CONFIG use config.ticks if defined in config object
    var xTickValues = xScale.ticks(this.ticks);

    xTickValues = xTickValues.concat(this.selection.map(this.xAcc));

    var xAxis = sszvis.axisX
      .time()
      .scale(xScale)
      .orient("bottom")
      .tickValues(xTickValues)
      .alignOuterLabels(true)
      .highlightTick(this.isSelected)
      .title(this.xLabel);

    var yAxis = sszvis
      .axisY()
      .scale(yScale)
      .orient("right")
      .contour(true)
      .tickLength(bounds.innerWidth)
      .title(this.yLabel)
      .dyTitle(-20);

    var yAxis2 = sszvis.axisY().scale(yScale).orient("right").contour(true);

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
      .bottom(bounds.innerHeight)
      .x(sszvis.compose(xScale, this.xAcc))
      .y(sszvis.compose(yScale, this.yAcc))
      .label(rulerLabel)
      .flip((d: Datum) => {
        return xScale(this.xAcc(d)) >= bounds.innerWidth / 2;
      })
      .color(sszvis.compose(cScale, this.cAcc));

    // Rendering

    chartLayer
      .selectGroup("xAxis")
      .attr("transform", sszvis.translateString(0, bounds.innerHeight))
      .call(xAxis);

    chartLayer.selectGroup("yAxis").call(yAxis);

    chartLayer.selectGroup("line").call(line);

    chartLayer.selectGroup("yAxis2").call(yAxis2);

    chartLayer
      .selectGroup("highlight")
      .datum(this.selection)
      .call(highlightLayer);

    // Interaction
    var interactionLayer = sszvis
      .move()
      .xScale(xScale)
      .yScale(yScale)
      .on("move", (e: MouseEvent, d: Date) => this.changeDate(e, d))
      .on("end", () => this.resetDate());

    chartLayer.selectGroup("interaction").call(interactionLayer);

    sszvis.viewport.on("resize", () => {
      this.requestUpdate();
    });
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    this.createChart();
  }

  render() {
    return html` <div id="sszvis-chart"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sszvis-line-chart-2": SSZVISLineChart2;
  }
}
