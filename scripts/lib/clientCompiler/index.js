"use strict";

// Do this as the first thing so that any code reading it knows the right env.
const nodeEnv = "production";
process.env.BABEL_ENV = nodeEnv;
process.env.NODE_ENV = nodeEnv;

const getProjectConfig = require("../getProjectConfig");
const path = require("path");
const chalk = require("react-dev-utils/chalk");
const fs = require("fs-extra");
const webpack = require("webpack");
const createWebpackConfig = require("../createWebpackConfig");
const checkRequiredFiles = require("react-dev-utils/checkRequiredFiles");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const printHostingInstructions = require("./printHostingInstructions");
const FileSizeReporter = require("react-dev-utils/FileSizeReporter");
const printBuildError = require("react-dev-utils/printBuildError");

function clientCompiler(opts) {
  const cfg = getProjectConfig("clientCompiler", nodeEnv, opts);

  // These sizes are pretty large. We'll warn for bundles exceeding them.
  const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
  const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

  // We require that you explicitly set browsers and do not fall back to
  // browserslist defaults.
  const { checkBrowsers } = require("react-dev-utils/browsersHelper");
  checkBrowsers(cfg.packageDir, cfg.isInteractive)
    .then(() => {
      // First, read the current file sizes in build directory.
      // This lets us display how much they changed later.
      return FileSizeReporter.measureFileSizesBeforeBuild(cfg.buildDir);
    })
    .then((previousFileSizes) => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      fs.emptyDirSync(cfg.buildDir);
      // Merge with the public folder
      fs.copySync(cfg.publicDir, cfg.buildDir, {
        dereference: true,
        filter: (file) => file !== cfg.indexHtmlPath,
      });

      console.log("Creating an optimized production build...");
      webpack(createWebpackConfig(cfg)).run((err, stats) => {
        let messages;
        if (err) {
          if (!err.message) {
            return handleCompilerError(err);
          }

          let errMessage = err.message;

          // Add additional information for postcss errors
          if (Object.prototype.hasOwnProperty.call(err, "postcssNode")) {
            errMessage +=
              "\nCompileError: Begins at CSS selector " +
              err["postcssNode"].selector;
          }

          messages = formatWebpackMessages({
            errors: [errMessage],
            warnings: [],
          });
        } else {
          messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true })
          );
        }
        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1;
          }
          return handleCompilerError(new Error(messages.errors.join("\n\n")));
        }

        if (messages.warnings.length) {
          if (cfg.isCI) {
            console.log(
              chalk.yellow(
                "\nTreating warnings as errors because process.env.CI = true.\n" +
                  "Most CI servers set it automatically.\n"
              )
            );
            return handleCompilerError(
              new Error(messages.warnings.join("\n\n"))
            );
          }

          console.log(chalk.yellow("Compiled with warnings.\n"));
          console.log(messages.warnings.join("\n\n"));
          console.log(
            "\nSearch for the " +
              chalk.underline(chalk.yellow("keywords")) +
              " to learn more about each warning."
          );
          console.log(
            "To ignore, add " +
              chalk.cyan("// eslint-disable-next-line") +
              " to the line before.\n"
          );
        } else {
          console.log(chalk.green("Compiled successfully.\n"));
        }

        console.log("File sizes after gzip:\n");
        FileSizeReporter.printFileSizesAfterBuild(
          stats,
          previousFileSizes,
          cfg.buildDir,
          WARN_AFTER_BUNDLE_GZIP_SIZE,
          WARN_AFTER_CHUNK_GZIP_SIZE
        );
        console.log();

        printHostingInstructions(
          require(cfg.packageDotJsonPath),
          cfg.mountingPath,
          path.relative(process.cwd(), cfg.buildDir),
          cfg.useYarn
        );
      });
    })
    .catch((err) => {
      if (err && err.message) {
        console.log(err.message);
      }
      process.exit(1);
    });

  function handleCompilerError(err) {
    if (cfg.tscCompileOnError) {
      console.log(
        chalk.yellow(
          "Compiled with the following type errors (you may want to check these before deploying your app):\n"
        )
      );
      printBuildError(err);
    } else {
      console.log(chalk.red("Failed to compile.\n"));
      printBuildError(err);
      process.exit(1);
    }
  }
}

module.exports = clientCompiler;
