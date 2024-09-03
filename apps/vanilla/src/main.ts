import "./style.css";

import "@repo/web-components";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <p>Styled Button<p>
    <styled-button variant="secondary" name="Lloyd"></styled-button>
    <p>Styled Panel<p>
    <styled-panel title="This Title" icon="👆" >
      Button inside panel
    </styled-panel>
    <p>DataTable<p>
    <data-table></data-table>
  </div>
`;

const panel = document.querySelector("styled-panel");
panel?.addEventListener("toggle", () => {
  console.log("Panel toggled");
});

const table = document.querySelector("data-table");
const data = [
  {
    category: "Apple",
    value: 10,
  },
  {
    category: "Banana",
    value: 20,
  },
  {
    category: "Cherry",
    value: 30,
  },
  {
    category: "Date",
    value: 40,
  },
];

table?.setAttribute("data", JSON.stringify(data));
