import Controller from "./Controller";
import Model from "./Model";
import ReactDOM from "react-dom";
import React from "react";
import View from "./View";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

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
// Learn more about service workers: https://cra.link/CRA-PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
