#!/usr/bin/env node

import fs from "fs";
import { minify } from "minify";
import TryToCatch from "try-to-catch";

const scriptFile = "./src/index.js";
const manifestFile = "./manifest.json";
const outFile = "./target/plugin.json";
const packageFile = "./package.json";

const manifest = JSON.parse(fs.readFileSync(manifestFile));
const packageInfo = JSON.parse(fs.readFileSync(packageFile));
const script = fs.readFileSync(scriptFile);

if (process.env.DEV) {
  const data = script.toString();

  manifest["entrypoint"] = data;
  manifest["id"] = `${manifest.id}-devel`
} else {
  const [error, data] = await TryToCatch(minify, scriptFile, {
    js: {
      ecma: 2016,
      format: {
        comments: false,
      },
      module: false,
    },
  });

  if (error) throw new Error(error);

  manifest["entrypoint"] = data;
}

manifest["version"] = packageInfo.version;

fs.writeFileSync(outFile, JSON.stringify(manifest) + "\n");

console.log(`Manifest written to ${outFile}!`);
