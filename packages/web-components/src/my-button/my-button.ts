import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { TW } from "../shared/tailwindMixin";

const TwLitElement = TW(LitElement);

/**
 * An example component.
 *
 */
@customElement("my-button")
export class MyButton extends TwLitElement {
  @property() name: string = "";
  @property() _isClicked: boolean = false;

  render() {
    return html`
      <div class="flex flex-col gap-2 justify-center items-center ">
        <p
          class="text-3xl font-bold underline underline-offset-4 decoration-orange-500"
        >
          Hello, ${this.name}!
        </p>
        <button
          class="cursor-pointer rounded-lg text-white border-4 border-transparent bg-[#f9f9f9] px-[1.2em] py-[0.6em] text-base transition-colors duration-[0.25s] hover:border-[#646cff] dark:bg-[#1a1a1a]"
          part="button"
          @click=${this._onClick}
        >
          ${this._isClicked ? "Clicked" : "Click me"}
        </button>
      </div>
    `;
  }

  private _onClick() {
    this._isClicked = !this._isClicked;
  }
}
