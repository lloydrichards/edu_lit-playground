import { LitElement, unsafeCSS, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./my-button.css?inline";
/**
 * An example component.
 *
 */
@customElement("my-button")
export class MyButton extends LitElement {
  @property({ type: String })
  name = "";

  @property({ type: Boolean })
  _isClicked = false;

  render() {
    return html`
      <p class="text-3xl font-bold underline">Hello, ${this.name}!</p>
      <button
        class="cursor-pointer rounded-lg border border-transparent bg-[#f9f9f9] px-[1.2em] py-[0.6em] text-base transition-colors duration-[0.25s] hover:border-[#646cff] dark:bg-[#1a1a1a]"
        part="button"
        @click=${this._onClick}
      >
        ${this._isClicked ? "Clicked" : "Click me"}
      </button>
    `;
  }

  private _onClick() {
    this._isClicked = !this._isClicked;
  }

  static get styles() {
    return unsafeCSS(styles);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-button": MyButton;
  }
}
