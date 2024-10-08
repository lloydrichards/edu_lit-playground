import { adoptStyles, type LitElement, unsafeCSS } from "lit";
import style from "../styles/tailwind.global.css?inline";

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  export type LitMixin<T = unknown> = new (...args: any[]) => T & LitElement;
}

const stylesheet = unsafeCSS(style);

export const TW = <T extends LitMixin>(superClass: T, ...styles: string[]): T =>
  class extends superClass {
    connectedCallback() {
      super.connectedCallback();
      if (this.shadowRoot) {
        const stylesheets = [stylesheet, ...styles.map(style => unsafeCSS(style))];
        adoptStyles(this.shadowRoot, stylesheets);
      }
    }
  };
