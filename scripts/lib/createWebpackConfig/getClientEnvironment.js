"use strict";

// Grab some environment variables and prepare them to be injected into the
// application via `DefinePlugin` and `InterpolateHtmlPlugin` in webpack
// configuration.
function getClientEnvironment(cfg) {
  const raw = {
    NODE_ENV: cfg.nodeEnv,
    REACT_APP_ENV: cfg.reactAppEnv,
    MOUNTING_PATH: cfg.mountingPath,
  };
  if (cfg.target === "devServer") {
    // sockjs configuration
    raw.WDS_SOCKET_HOST = cfg.devServer.socketHost;
    raw.WDS_SOCKET_PORT = cfg.devServer.socketPort;
    raw.WDS_SOCKET_PATH = cfg.devServer.socketPath;
  }

  // Stringify all values so we can feed into webpack DefinePlugin
  const jsEnv = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  // If `REACT_APP_ENV` is an object we want to access its properties
  // as `%REACT_APP_ENV.foo%` when we are on `public/index.html`.
  const htmlEnv =
    typeof cfg.reactAppEnv === "object"
      ? Object.keys(cfg.reactAppEnv).reduce(
          (htmlEnv, key) => {
            htmlEnv[`REACT_APP_ENV.${key}`] = cfg.reactAppEnv[key];
            return htmlEnv;
          },
          { ...raw }
        )
      : raw;

  return { js: jsEnv, html: htmlEnv };
}

module.exports = getClientEnvironment;
