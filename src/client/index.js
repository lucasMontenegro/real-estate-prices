import Controller from "./Controller";
import Model from "./Model";
import ReactDOM from "react-dom";
import React from "react";
import View from "./View";
import * as serviceWorker from "./serviceWorker";

const ctl = new Controller();
const model = new Model(ctl);

ReactDOM.render(
  <React.StrictMode>
    <View ctl={ctl} />
  </React.StrictMode>,
  document.getElementById("root")
);

model.run();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
