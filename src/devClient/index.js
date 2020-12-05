import fxt from "./fixtures";
import View from "src/client/View";
import FixtureViewer from "./lib/FixtureViewer";
import ReactDOM from "react-dom";
import React from "react";

const viewer = new FixtureViewer(fxt, View);

ReactDOM.render(
  <React.StrictMode>
    <viewer.ReactComponent />
  </React.StrictMode>,
  document.getElementById("root")
);

viewer.run();
