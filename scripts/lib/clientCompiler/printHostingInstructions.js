// Based upon `react-dev-utils/printHostingInstructions`.

"use strict";

const chalk = require("chalk");
const fs = require("fs");

function printHostingInstructions(
  packageDotJson,
  mountingPath,
  buildDir,
  useYarn
) {
  let origin;
  if (packageDotJson.homepage) {
    try {
      ({ origin } = new URL(packageDotJson.homepage));
    } catch (e) {
      if (e.code !== "ERR_INVALID_URL") {
        throw e;
      }
    }
  }
  const useGitHub = origin && origin.includes(".github.io");
  origin = origin || "http://yourdomain.com";
  const isRootApp = mountingPath === "/";

  console.log(
    `The project was built assuming it is hosted at ${chalk.cyan(
      isRootApp ? "the server root" : mountingPath
    )}.`
  );
  if (isRootApp) {
    printMountingInstructions(useGitHub ? origin : "http://myname.github.io");
  }
  console.log(`The ${chalk.cyan(buildDir)} folder is ready to be deployed.`);

  if (useGitHub) {
    // don't make the message too long
    if (!isRootApp) {
      // http://user.github.io/project
      const url = new URL(mountingPath, origin).href;
      console.log(`To publish it at ${chalk.cyan(url)}, run:`);
      console.log();

      // If deploy script has been added to package.json, skip the instructions
      if (
        typeof packageDotJson.scripts !== "object" ||
        typeof packageDotJson.scripts.deploy !== "string" ||
        !packageDotJson.scripts.deploy
      ) {
        printGitHubDeployment(useYarn);
      }
      console.log(`  ${chalk.cyan(useYarn ? "yarn" : "npm")} run deploy`);
      console.log();
    }
  } else if (isRootApp) {
    // http://mywebsite.com
    console.log("You may serve it with a static server:");
    console.log();
    console.log(`  ${chalk.cyan("npx")} serve -s ${buildDir}`);
    console.log();
  }
  // Non-root mounting path and not a GH Pages project, so nothing else to say.
}
function printMountingInstructions(origin) {
  console.log(
    `You can control this with the ${chalk.green("mountingPath")} option.`
  );
  console.log("For example, add this to build it for GitHub Pages:");
  console.log();
  console.log(chalk.dim("  Your build script:"));
  console.log();
  console.log(`    ${chalk.cyan("clientCompiler")}({`);
  console.log(chalk.dim("      // ..."));
  console.log(
    `      ${chalk.yellow("mountingPath")}${chalk.blue(":")} ${chalk.yellow(
      '"/myapp"'
    )},`
  );
  console.log("    });");
  console.log();
  console.log(
    `Alternatively you can use the ${chalk.green(
      "homepage"
    )} field in your ${chalk.cyan("package.json")}:`
  );
  console.log();
  console.log(chalk.dim("  Your build script:"));
  console.log();
  console.log(`    ${chalk.cyan("clientCompiler")}({`);
  console.log(chalk.dim("      // ..."));
  console.log(
    `      ${chalk.yellow("mountingPath")}${chalk.blue(":")} ${chalk.yellow(
      '"use_package_homepage"'
    )},`
  );
  console.log("    });");
  console.log();
  console.log(chalk.dim("  package.json:"));
  console.log();
  console.log(
    `      ${chalk.magentaBright('"homepage"')}: ${chalk.magentaBright(
      `"${origin}/myapp"`
    )},`
  );
  console.log(chalk.dim("      // ..."));
  console.log();
}

function printGitHubDeployment(useYarn) {
  if (useYarn) {
    console.log(`  ${chalk.cyan("yarn")} add --dev gh-pages`);
  } else {
    console.log(`  ${chalk.cyan("npm")} install --save-dev gh-pages`);
  }
  console.log();

  console.log(
    `Add the following script in your ${chalk.cyan("package.json")}.`
  );
  console.log();

  console.log(`    ${chalk.dim("// ...")}`);
  console.log(`    ${chalk.magentaBright('"scripts"')}: {`);
  console.log(`      ${chalk.dim("// ...")}`);
  console.log(
    `      ${chalk.magentaBright('"predeploy"')}: ${chalk.magentaBright(
      `"${useYarn ? "yarn" : "npm run"} build"`
    )},`
  );
  console.log(
    `      ${chalk.magentaBright('"deploy"')}: ${chalk.magentaBright(
      '"gh-pages -d build"'
    )}`
  );
  console.log("    }");
  console.log();

  console.log("Then run:");
  console.log();
}

module.exports = printHostingInstructions;
