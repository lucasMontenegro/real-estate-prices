"use strict";

const fs = require("fs");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const noopServiceWorkerMiddleware = require("react-dev-utils/noopServiceWorkerMiddleware");
const ignoredFiles = require("react-dev-utils/ignoredFiles");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");
const getHttpsConfig = require("./getHttpsConfig");
const escapeStringRegexp = require("escape-string-regexp");

function createDevServerConfig({
  projectConfig: cfg,
  // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
  proxy,
  allowedHost,
}) {
  return {
    disableHostCheck: !proxy || cfg.devServer.DANGEROUSLY_DISABLE_HOST_CHECK,
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: "none",
    contentBase: cfg.publicDir,
    contentBasePublicPath: cfg.mountingPath,
    // By default files from `contentBase` will not trigger a page reload.
    watchContentBase: true,
    // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: "ws",
    // Prevent a WS client from getting injected as we're already including
    // `webpackHotDevClient`.
    injectClient: false,
    sockHost: cfg.devServer.socketHost,
    sockPort: cfg.devServer.socketPort,
    sockPath: cfg.devServer.socketPath, // default: '/sockjs-node'
    // It is important to tell WebpackDevServer to use the same "publicPath" path as
    // we specified in the webpack config.
    // Remove last slash so user can land on `/test` instead of `/test/`
    publicPath: cfg.mountingPath.slice(0, -1),
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebook/create-react-app/issues/293
    // src/node_modules is not ignored to support absolute imports
    // https://github.com/facebook/create-react-app/issues/1065
    watchOptions: {
      ignored: ignoredFiles(cfg.srcDir),
    },
    https: getHttpsConfig(cfg),
    host: cfg.devServer.host,
    overlay: false,
    historyApiFallback: {
      rewrites: [
        {
          // Match everything that doesn't start with `MOUNTING_PATH`.
          from: new RegExp(
            `^(?!${escapeStringRegexp(cfg.mountingPath).slice(0, -1)}[$/])`
          ),
          // This will set `ctx.request.url` to itself and call `next()`.
          // We do it since we don't want to send `index.html` to requests
          // outside the app mounting point (`contentBasePublicPath`).
          to: (ctx) => ctx.request.url,
        },
      ],
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: cfg.mountingPath,
    },
    public: allowedHost,
    proxy,
    before(app, server) {
      // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());

      if (fs.existsSync(cfg.devServer.proxySetupPath)) {
        require(cfg.devServer.proxySetupPath)(app);
      }
    },
    after(app) {
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware(cfg.mountingPath));
    },
  };
}

module.exports = createDevServerConfig;
