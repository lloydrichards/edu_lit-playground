"use client";

import React from "react";

import {
  StyledButtonReact,
  DataTableReact,
  StyledPanelReact,
} from "@repo/web-components";

type WebComponentsProps = {};

export const WebComponents: React.FC<WebComponentsProps> = ({}) => {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }
  return (
    <div className="flex flex-col gap2">
      WebComponents
      <StyledPanelReact
        title="Panel Title"
        onToggle={() => {
          console.log("Clicked");
        }}
      >
        <p>Panel Content</p>
      </StyledPanelReact>
      <DataTableReact
        data={[
          { category: "A", value: 1 },
          {
            category: "B",
            value: 2,
          },
        ]}
      />
      <StyledButtonReact name="Please"></StyledButtonReact>
    </div>
  );
};
