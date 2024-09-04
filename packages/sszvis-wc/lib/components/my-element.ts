import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import litLogo from "../assets/lit.svg";
import viteLogo from "/vite.svg";

import { TW } from "../shared/tailwindMixin";

const TwLitElement = TW(LitElement);

@customElement("my-element")
export class MyElement extends TwLitElement {
  @property() docsHint = "Click on the Vite and Lit logos to learn more";
  @property({ type: Number }) count = 0;

  render() {
    return html`
      <div class="flex flex-col justify-center items-center gap-2 w-screen">
        <div class="flex gap-8">
          <a href="https://vitejs.dev" target="_blank">
            <img src=${viteLogo} class="size-14" alt="Vite logo" />
          </a>
          <a href="https://lit.dev" target="_blank">
            <img src=${litLogo} class="size-14" alt="Lit logo" />
          </a>
        </div>
        <slot></slot>
        <div class="px-8">
          <button
            class="rounded-lg w-full border border-purple-800 px-5 py-3 font-bold cursor-pointer"
            @click=${this._onClick}
            part="button"
          >
            count is ${this.count}
          </button>
        </div>
        <p class="text-gray-400">${this.docsHint}</p>
      </div>
    `;
  }

  private _onClick() {
    this.count++;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
