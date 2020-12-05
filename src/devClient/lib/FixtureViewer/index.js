import React from "react";

class FixtureViewer {
  constructor(fxt, AppView) {
    this.AppView = AppView;
    this.ReactComponent = this.ReactComponent.bind(this);
  }
  ReactComponent(props) {
    return <this.AppView {...props} />;
  }
  run() {}
}

export default FixtureViewer;
