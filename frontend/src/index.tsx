import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { CtxWrapper } from "./state";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CtxWrapper>
      <Router />
    </CtxWrapper>
  </React.StrictMode>
);
