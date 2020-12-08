"use strict";

const { resolveApp, resolveModule } = require("./paths");
const checkRequiredFiles = require("react-dev-utils/checkRequiredFiles");
const path = require("path");
const fs = require("fs");
const chalk = require("react-dev-utils/chalk");

// NOTE ABOUT THE CLIENT ENVIRONMENT:
// Some options can be accessed as environment variables inside
// `public/index.html` by placing %FOO% anywhere in the file (where `FOO`
// is the variable name).
// They can also be accessed inside any javascript module compiled by
// webpack. To use them just place something like this in your code:
// `process.env.FOO`.

function getProjectConfig(target, ...args) {
  let [nodeEnv, opts] = typeof args[0] === "string" ? args : [null, args[0]];
  const isTarget = (...arr) => arr.includes(target);
  const cfg = { target, devServer: {} };

  if (isTarget("devServer")) {
    if (!opts.devServer) {
      opts = { ...opts, devServer: {} };
    }

    // Tools like Cloud9 rely on this.
    cfg.devServer.favoritePort = opts.devServer.favoritePort || 3000;

    cfg.devServer.host = opts.devServer.host || "0.0.0.0";
    cfg.devServer.useHttps = opts.devServer.useHttps;
    cfg.devServer.sslCrtPath = opts.devServer.sslCrtPath;
    cfg.devServer.sslKeyPath = opts.devServer.sslKeyPath;

    // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
    // websites from potentially accessing local content through DNS rebinding:
    // https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // However, it made several existing use cases such as development in cloud
    // environment or subdomains in development significantly more complicated:
    // https://github.com/facebook/create-react-app/issues/2271
    // https://github.com/facebook/create-react-app/issues/2233
    // While we're investigating better solutions, for now we will take a
    // compromise. Since our WDS configuration only serves files in the `public`
    // folder we won't consider accessing them a vulnerability. However, if you
    // use the `proxy` feature, it gets more dangerous because it can expose
    // remote code execution vulnerabilities in backends like Django and Rails.
    // So we will disable the host check normally, but enable it if you have
    // specified the `proxy` setting. Finally, we let you override it if you
    // really know what you're doing with a special environment variable.
    cfg.devServer.DANGEROUSLY_DISABLE_HOST_CHECK =
      opts.devServer.DANGEROUSLY_DISABLE_HOST_CHECK === true;

    // This registers user provided middleware for proxy reasons.
    cfg.devServer.proxySetupPath = resolveApp(
      opts.devServer.proxySetupPath || "src/setupProxy.js"
    );

    // `sockjs` is used by webpack-dev-server for triggering hot module reloads.
    // These settings are passed to the client as WDS_SOCKET_HOST,
    // WDS_SOCKET_PORT and WDS_SOCKET_PATH to let webpackHotDevClient connect
    // to the server. They allow developers to run multiple simultaneous
    // projects.
    cfg.devServer.socketHost = opts.devServer.socketHost;
    cfg.devServer.socketPort = opts.devServer.socketPort;
    cfg.devServer.socketPath = opts.devServer.socketPath;

    // `react-refresh` is not 100% stable at this time, which is why it's
    // disabled by default.
    // We pass it to the client as an environment variable so it is available
    // in the `webpackHotDevClient`.
    cfg.devServer.fastRefresh = opts.devServer.fastRefresh === true;
    // Note: Add this to `node_modules/react-dev-utils/webpackHotDevClient`:
    // diff --git a/packages/react-dev-utils/webpackHotDevClient.js b/packages/react-dev-utils/webpackHotDevClient.js
    // index 1054ce48..0379358f 100644
    // --- a/packages/react-dev-utils/webpackHotDevClient.js
    // +++ b/packages/react-dev-utils/webpackHotDevClient.js

    // @@ -243,7 +243,10 @@ function tryApplyUpdates(onHotUpdateSuccess) {
    //    }
    //
    //    function handleApplyUpdates(err, updatedModules) {
    // -    if (err || !updatedModules || hadRuntimeError) {
    // +    const hasReactRefresh = process.env.FAST_REFRESH;
    // +    const wantsForcedReload = err || !updatedModules || hadRuntimeError;
    // +    // React refresh can handle hot-reloading over errors.
    // +    if (!hasReactRefresh && wantsForcedReload) {
    //        window.location.reload();
    //        return;
    //      }
  }

  if (isTarget("clientCompiler")) {
    cfg.buildDir = resolveApp(opts.buildDir || "build");
  }

  if (isTarget("clientCompiler", "devServer")) {
    cfg.indexHtmlPath = resolveApp(opts.indexHtmlPath || "public/index.html");
    cfg.indexJsPath = resolveModule(opts.indexJsPath || "src/index");

    // Warn and crash if required files are missing.
    if (!checkRequiredFiles([cfg.indexHtmlPath, cfg.indexJsPath])) {
      process.exit(1);
    }

    cfg.packageDir = resolveApp(".");
    cfg.packageDotJsonPath = resolveApp("package.json");
    cfg.nodeModulesDir = resolveApp("node_modules");
    cfg.srcDir = resolveApp(opts.srcDir || "src");

    cfg.isInteractive = process.stdout.isTTY;

    // Source maps are resource heavy and can cause out of memory issue for large
    // source files.
    cfg.generateSourcemap = opts.generateSourcemap !== false;
    // Some apps do not need the benefits of saving a web request, so not
    // inlining the chunk makes for a smoother build process.
    cfg.inlineRuntimeChunk = opts.inlineRuntimeChunk !== false;
    // `url-loader` image size limit.
    cfg.imageInlineSizeLimit = opts.imageInlineSizeLimit || 10000;

    // Environment variable for passing any custom value to the client.
    // Available in the client as `REACT_APP_ENV`.
    // When set to an object we can access its properties by placing
    // `%REACT_APP_ENV.foo%` anywhere in `public/index.html`.
    cfg.reactAppEnv = opts.reactAppEnv; // no default value

    // Useful for determining whether we’re running in production mode.
    // Most importantly, it switches React into the correct mode.
    // Available in the client environment as `NODE_ENV`.
    cfg.nodeEnv = nodeEnv;

    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `public/index.html`, you can get path of `public` folder with
    // %MOUNTING_PATH%:
    // <link rel="icon" href="%MOUNTING_PATH%favicon.ico">
    // In JavaScript code, you can access it with `process.env.MOUNTING_PATH`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    //
    // For example, if your application is mounted at
    // `http://example.com/foo/bar`, you have to set `mountingPath` to
    // `/foo/bar/`. Then add a `base` HTML element in the head element of your
    // `public/index.html`. Like this: `<base href="%MOUNTING_PATH%" />`.
    // Finally you can add images like this: `<img src="logo.png" />`.
    // Where `logo.png` can be found in the `public` folder and is being
    // served as: `http://example.com/foo/bar/logo.png`.
    // Learn more about the `base` element at:
    // `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base`.
    cfg.publicDir = resolveApp(opts.publicDir || "public");

    if (opts.mountingPath === "use_package_homepage") {
      let { homepage } = require(cfg.packageDotJsonPath);
      if (!homepage) {
        console.log(chalk.red("Missing package homepage configuration.\n"));
        process.exit(1);
      }

      try {
        homepage = new URL(homepage);
      } catch (e) {
        if (e.code === "ERR_INVALID_URL") {
          console.log(
            chalk.red("Package homepage field should be a valid URL.\n")
          );
          process.exit(1);
        }
        throw e;
      }
      cfg.mountingPath = homepage.pathname;
    } else {
      cfg.mountingPath = opts.mountingPath
        ? // Make sure we provide leading and trailing backslashes.
          path.normalize(`/${opts.mountingPath}/`)
        : "/";
    }

    // If true, errors in TypeScript type checking will not prevent devServer
    // from running the app. It also downgrades all TypeScript type checking
    // error messages to warning messages.
    cfg.tscCompileOnError = opts.tscCompileOnError === true;

    // To enable typescript create a tsconfig file.
    cfg.tsConfigPath = resolveApp("tsconfig.json");
    cfg.useTypeScript = fs.existsSync(cfg.tsConfigPath);

    cfg.useYarn = fs.existsSync(resolveApp("yarn.lock"));
  }

  if (isTarget("clientCompiler", "devServer", "jestQa")) {
    // Detect continuous integration environment.
    cfg.isCI = Boolean(opts.CI) && opts.CI.toLowerCase() !== "false"; // default false
  }
  return cfg;
}

module.exports = getProjectConfig;
