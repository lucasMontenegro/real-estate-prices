"use strict";

const fs = require("fs");
const path = require("path");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

// Resolve file paths in the same order as webpack
const resolveModule = (filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveApp(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveApp(`${filePath}.${extension}`);
  }

  return resolveApp(`${filePath}.js`);
};

module.exports = {
  resolveApp,
  moduleFileExtensions,
  resolveModule,
};
