import { Task } from "@lit/task";
import { ascending, csv, extent, max, scaleLinear, scaleTime } from "d3";
import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { closestDatum, Datum } from "./utils";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("sszvis-line-chart")
export class SSZVISLineChart extends TwLitElement {
  @property({ type: String }) dataSrc = "";
  @property({ type: String }) title = "";
  @property({ type: String }) description = "";
  @property({ type: String }) xCol = "";
  @property({ type: String }) yCol = "";
  @property({ type: String }) cCol = "";
  @property({ type: String }) yLabel = "";
  @property({ type: String }) xLabel = "";
  @property({ type: Number }) ticks = 10;

  @property({ type: Object, reflect: true }) margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = { top: 60, right: 20, bottom: 130, left: 20 };

  @state() _data: Datum[] = [];
  @state() data: Array<Datum[]> = [];
  @state() xRange: [Date, Date] = [new Date(), new Date()];
  @state() yRange: [number, number] = [0, 0];
  @state() categorySet: Set<string> = new Set();

  @state() selection: Datum[] = [];

  private xAcc = (d: Datum) => d.xValue;
  private yAcc = (d: Datum) => d.yValue;
  private cAcc = (d: Datum) => d.category;

  private _prepareState = new Task(this, {
    task: async ([dataSrc]) => {
      const data = await csv(dataSrc, (d) => ({
        xValue: sszvis.parseYear(d[this.xCol]),
        yValue: sszvis.parseNumber(d[this.yCol]),
        category: d[this.cCol],
      }));
      this._data = data;
      this.data = sszvis.cascade().arrayBy(this.cAcc, ascending).apply(data);
      this.xRange = extent(data, this.xAcc) as [Date, Date];
      this.yRange = [0, max(data, this.yAcc) ?? 5000];
      this.categorySet = sszvis.set(data, this.cAcc);
    },
    args: () => [this.dataSrc],
  });

  private isSelected(d: Datum) {
    if (!this.selection) return false;
    return sszvis.contains(
      this.selection.map(this.xAcc).map(String),
      String(d)
    );
  }

  private changeDate(_e: MouseEvent | null, inputDate: Date) {
    var closestDate = this.xAcc(closestDatum(this._data, this.xAcc, inputDate));
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
    var mostRecentDate = max(this._data, this.xAcc) ?? new Date();
    this.changeDate(null, mostRecentDate);
  }

  private createChart() {
    var bounds = sszvis.bounds(
      { top: this.margin.top, bottom: this.margin.bottom },
      this.shadowRoot?.querySelector("#sszvis-chart")
    );

    // Scales
    var xScale = scaleTime().domain(this.xRange).range([0, bounds.innerWidth]);

    var yScale = scaleLinear()
      .domain(this.yRange)
      .range([bounds.innerHeight, 0]);

    var cScale =
      this.categorySet.size > 6 ? sszvis.scaleQual12() : sszvis.scaleQual6();
    cScale.domain(this.categorySet);

    // Layers
    var chartLayer = sszvis
      .createSvgLayer(this.shadowRoot?.querySelector("#sszvis-chart"), bounds, {
        // CONFIG
        title: "",
        description: "",
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
      // CONFIG
      .title(this.xLabel || "");

    var yAxis = sszvis
      .axisY()
      .scale(yScale)
      .orient("right")
      .contour(true)
      // CONFIG
      .tickLength(bounds.innerWidth)
      // CONFIG
      .title(this.yLabel || "")
      .dyTitle(-20);

    // CONFIG use a second x-Axis with only tick labels.
    // Necessary in order to prevent horizontal lines to be drawn above data lines
    // if config.fallback == true
    var yAxis2 = sszvis.axisY().scale(yScale).orient("right").contour(true);

    var rulerLabel = sszvis
      .modularTextSVG()
      .bold(sszvis.compose(sszvis.formatNumber, this.yAcc))
      // CONFIG use category name as ruler label
      .plain((d: Datum) => {
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

    var cLegend = sszvis
      .legendColorOrdinal()
      .scale(cScale)
      .horizontalFloat(true)
      .floatWidth(bounds.innerWidth);

    // Rendering

    chartLayer
      .selectGroup("xAxis")
      .attr("transform", sszvis.translateString(0, bounds.innerHeight))
      .call(xAxis);

    // CONFIG draw yAxis with long horizontal ticks (if config.fallback == true)
    // before the data lines
    chartLayer.selectGroup("yAxis").call(yAxis);

    // CONFIG draw data lines above long horizonzal ticks (if config.fallback == true)
    chartLayer.selectGroup("line").call(line);

    // CONFIG draw tick labels with contours once again so that they are above the data lines
    //(if config.fallback == true) Maybe there is an easier solution to this issue
    chartLayer.selectGroup("yAxis2").call(yAxis2);

    chartLayer
      .selectGroup("cScale")
      // the color legend should always be positioned 60px below the bottom axis
      .attr("transform", sszvis.translateString(1, bounds.innerHeight + 60))
      .call(cLegend);

    chartLayer
      .selectGroup("highlight")
      .datum(this.selection)
      .call(highlightLayer);
    //   .call(separateTwoLabelsVerticalOverlap);

    // Interaction
    var interactionLayer = sszvis
      .move()
      .xScale(xScale)
      .yScale(yScale)
      .on("move", (e: MouseEvent, d: Date) => this.changeDate(e, d))
      .on("end", this.resetDate);

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
    return this._prepareState.render({
      initial: () => html`<p>Initializing...</p>`,
      pending: () => html`<p>Loading csv data...</p>`,
      complete: () => {
        return html` <div id="sszvis-chart"></div> `;
      },
      error: (e) => html`<p>Error: ${e}</p>`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sszvis-line-chart": SSZVISLineChart;
  }
}
