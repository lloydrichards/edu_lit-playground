import { Card } from "@repo/ui/card";
import "./App.css";

import {
  StyledButtonReact,
  StyledPanelReact,
  DataTableReact,
  BarChartReact,
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
      <BarChartReact
        data={[
          { category: "A", value: 1 },
          { category: "B", value: 2 },
          { category: "C", value: 3 },
          { category: "D", value: 4 },
          { category: "E", value: 5 },
        ]}
      />
    </main>
  );
}

export default App;
