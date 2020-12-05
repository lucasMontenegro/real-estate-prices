// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const localConfig = require("./config.local");

require("../lib/devServer")({
  indexJsPath: "src/devClient/index",
  devServer: {
    host: "127.0.0.1",
    ...localConfig.devServer,
  },
  ...localConfig,
});
