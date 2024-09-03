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
  </div>
`;

const panel = document.querySelector("styled-panel");
panel?.addEventListener("toggle", () => {
  console.log("Panel toggled");
});
