import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { TW } from "../shared/tailwindMixin";
import { when } from "lit-html/directives/when.js";

const TwLitElement = TW(LitElement);

// const panelVariant = cva("", {
//   variants: {
//     variant: {
//       primary: "",
//     },
//   },
//   defaultVariants: {
//     variant: "primary",
//   },
// });

@customElement("styled-panel")
export class StyledPanel extends TwLitElement {
  @property({ type: String }) title = "Panel Title";
  @property({ type: Boolean }) open = false;
  @property({ type: String }) icon = "⭐️";

  private onToggleHandler = (e: MouseEvent) => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("toggle", { bubbles: true }));
  };

  render() {
    return html`
      <div class="flex flex-col min-w-48">
        <div
          class="px-3 py-2 flex justify-between rounded-t bg-background text-foreground"
          @click=${this._onToggle}
        >
          <span class="uppercase"> ${this.title} </span>
          <div
            data-state=${this.open ? "open" : "closed"}
            class="cursor-pointer data-[state=open]:rotate-180 transition-transform"
            @click=${this.onToggleHandler}
          >
            ${this.icon}
          </div>
        </div>
        ${when(
          this.open,
          () =>
            html`<div class="rounded-b bg-popover text-popover-foreground p-4">
              <slot></slot>
            </div>`,
          () =>
            html`<div
              class="rounded-b border-t border-border p-2 bg-background"
            ></div>`
        )}
      </div>
    `;
  }

  _onToggle = () => {
    this.open = !this.open;
  };
}
