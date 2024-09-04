import "./style.css";

import "@repo/web-components";

const panel = document.querySelector("styled-panel");
panel?.addEventListener("toggle", () => {
  console.log("Panel toggled");
});

const newData = Array.from({ length: 10 }, (_, index) => ({
  category: `Item ${index + 1}`,
  value: Math.floor(Math.random() * 86) + 15,
}));

const table = document.querySelector("data-table");

table?.setAttribute("data", JSON.stringify(newData));

const chart = document.querySelector("bar-chart");
chart?.setAttribute("data", JSON.stringify(newData));
