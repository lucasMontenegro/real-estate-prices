"use strict";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

let localConfig;
try {
  localConfig = require("./config.local");
} catch (e) {
  if (e.message !== "Cannot find module './config.local'") {
    throw e;
  }
  localConfig = {};
}

require("../lib/clientCompiler")({
  indexJsPath: "src/client/index",
  buildDir: "client",
  ...localConfig,
});
