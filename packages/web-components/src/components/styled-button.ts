import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import * as React from "react";
import { TW } from "../shared/tailwindMixin";
import { cva, VariantProps } from "class-variance-authority";
import { createComponent } from "@lit/react";

const TwLitElement = TW(LitElement);

const buttonVariants = cva(
  "inline-flex items-center text-primary uppercase justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "rounded bg-background text-primary hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent",
        link: "text-foreground underline decoration-tertiary underline-offset-4 hover:bg-tertiary hover:text-tertiary-foreground hover:no-underline",
      },
      size: {
        default: "px-4 py-3",
        icon: "rounded-full p-2",
        sm: "rounded px-3 py-1",
        fit: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

@customElement("styled-button")
export class StyledButton extends TwLitElement {
  @property({ type: String }) name = "";
  @property({ type: Boolean }) _isClicked = false;
  @property() variant: VariantProps<typeof buttonVariants>["variant"] =
    "primary";
  @property() size: VariantProps<typeof buttonVariants>["size"] = "default";

  render() {
    return html`
      <button
        class="${buttonVariants({ size: this.size, variant: this.variant })} "
        part="button"
        @click=${this._onClick}
      >
        ${this._isClicked ? "Clicked" : `Click me, ${this.name}`}
      </button>
    `;
  }

  private _onClick() {
    this._isClicked = !this._isClicked;
  }
}

export const StyledButtonReact = createComponent({
  react: React,
  tagName: "styled-button",
  elementClass: StyledButton,
  displayName: "StyledButton",
});

declare global {
  interface HTMLElementTagNameMap {
    "styled-button": StyledButton;
  }
}
