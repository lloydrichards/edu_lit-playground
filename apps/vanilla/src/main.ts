import "./style.css";

import "@repo/web-components";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <p>Styled Button<p>
    <styled-button variant="secondary" name="Lloyd"></styled-button>
  </div>
`;
