"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const chalk = require("react-dev-utils/chalk");

// Ensure the certificate and key provided are valid and if not
// throw an easy to debug error
function validateKeyAndCerts({ cert, key, keyPath, crtPath }) {
  let encrypted;
  try {
    // publicEncrypt will throw an error with an invalid cert
    encrypted = crypto.publicEncrypt(cert, Buffer.from("test"));
  } catch (err) {
    throw new Error(
      `The certificate "${chalk.yellow(crtPath)}" is invalid.\n${err.message}`
    );
  }

  try {
    // privateDecrypt will throw an error with an invalid key
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error(
      `The certificate key "${chalk.yellow(keyPath)}" is invalid.\n${
        err.message
      }`
    );
  }
}

// Read file and throw an error if it doesn't exist
function readEnvFile(filepath, type) {
  if (!fs.existsSync(filepath)) {
    throw new Error(
      `You specified ${chalk.cyan(
        type
      )} in your env, but the file "${chalk.yellow(filepath)}" can't be found.`
    );
  }
  return fs.readFileSync(filepath);
}

// Get the https config
// Return cert files if provided in env, otherwise just true or false
function getHttpsConfig(cfg) {
  const useHttps = cfg.devServer.useHttps;
  let crtPath = cfg.devServer.sslCrtPath;
  let keyPath = cfg.devServer.sslKeyPath;

  if (useHttps && crtPath && keyPath) {
    crtPath = path.resolve(packageDir, crtPath);
    keyPath = path.resolve(packageDir, keyPath);
    const config = {
      cert: readEnvFile(crtPath, "SSL_CRT_FILE"),
      key: readEnvFile(keyPath, "SSL_KEY_FILE"),
    };

    validateKeyAndCerts({ ...config, keyPath, crtPath });
    return config;
  }
  return cfg.devServer.useHttps;
}

module.exports = getHttpsConfig;
