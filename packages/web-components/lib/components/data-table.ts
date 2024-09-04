import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import * as React from "react";

import { TW } from "../shared/tailwindMixin";
import { createComponent } from "@lit/react";

const TwLitElement = TW(LitElement);

type Datum = {
  category: string;
  value: number;
};

@customElement("data-table")
export class DataTable extends TwLitElement {
  @property({ type: Array, reflect: true }) data: Array<Datum> = [];

  render() {
    return html`
      <table class="min-w-96 text-center divide-y divide-border">
        <thead>
          <tr class="bg-accent/10">
            <th
              scope="col"
              class="px-6 py-3 text-xs font-medium text-background uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-center text-xs font-medium text-background uppercase tracking-wider"
            >
              Value
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          ${this.data.length > 0
            ? this.data.map(
                (datum) => html`
                  <tr class="hover:bg-accent/10">
                    <td
                      class="px-6 py-3 whitespace-nowrap text-sm font-medium text-background/60"
                    >
                      ${datum.category}
                    </td>
                    <td
                      class=" text-right px-6 py-3 whitespace-nowrap text-sm text-background/80"
                    >
                      ${datum.value}
                    </td>
                  </tr>
                `
              )
            : html`
                <tr>
                  <td
                    class="px-6 py-3 whitespace-nowrap text-sm font-medium text-background/60"
                    colspan="2"
                  >
                    No data
                  </td>
                </tr>
              `}
          <tr class="bg-accent/20">
            <td class="uppercase font-bold">Total</td>
            <td
              class="px-6 text-right font-bold py-2 whitespace-nowrap text-sm text-background"
            >
              ${this.data.reduce((acc, { value }) => acc + value, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }
}

export const DataTableReact = createComponent({
  react: React,
  elementClass: DataTable,
  tagName: "data-table",
  displayName: "DataTable",
});

declare global {
  interface HTMLElementTagNameMap {
    "data-table": DataTable;
  }
}
