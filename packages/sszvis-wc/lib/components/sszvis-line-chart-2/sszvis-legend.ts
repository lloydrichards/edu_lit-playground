import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as sszvis from "sszvis";
import sszvisStylesheet from "sszvis/build/sszvis.css?inline";
import { TW } from "../../shared/tailwindMixin";

import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

const TwLitElement = TW(LitElement, sszvisStylesheet);

@customElement("sszvis-legend")
export class SSZVISLegend extends TwLitElement {
  @property({ type: Object }) categorySet: Set<string> = new Set();

  render() {
    var cScale =
      this.categorySet.size > 6 ? sszvis.scaleQual12() : sszvis.scaleQual6();
    cScale.domain(this.categorySet);

    return html`<div class="flex flex-wrap gap-x-4 gap-y-1">
      ${repeat(
        this.categorySet,
        (category) => category,
        (category) =>
          html` <div class="flex gap-2 items-center">
            <div
              style="${styleMap({
                backgroundColor: cScale(category),
                width: "10px",
                height: "10px",
                borderRadius: "50%",
              })}"
            ></div>
            <p class="text-xs font-[--stzh-font] text-[#767676]">${category}</p>
          </div>`
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sszvis-legend": SSZVISLegend;
  }
}
