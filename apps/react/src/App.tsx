import { Card } from "@repo/ui/card";
import "./App.css";

import {
  StyledButtonReact,
  StyledPanelReact,
  DataTableReact,
} from "@repo/web-components";

function App() {
  return (
    <main>
      <Card href="https://turbo.build/repo/docs" title="Docs">
        Find in-depth information about Turborepo features and API.
      </Card>
      <StyledPanelReact
        title="Panel Title"
        onToggle={() => {
          console.log("Clicked");
        }}
      >
        <p>Panel Content</p>
      </StyledPanelReact>
      <DataTableReact data={[{ category: "A", value: 1 }]} />
      <StyledButtonReact name="Please"></StyledButtonReact>
    </main>
  );
}

export default App;
