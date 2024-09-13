#!/usr/bin/env node

import fs from "fs";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";

import webpack from "webpack";
import TryToCatch from "try-to-catch";


const scriptFile = "./src/index.cjs";
const manifestFile = "./manifest.json";
const outFile = "./target/plugin.json";
const packageFile = "./package.json";

const manifest = JSON.parse(fs.readFileSync(manifestFile));
const packageInfo = JSON.parse(fs.readFileSync(packageFile));
const script = fs.readFileSync(scriptFile);
import * as esbuild from 'esbuild'

if (process.env.DEV) {
  const data = script.toString();

  manifest["entrypoint"] = data;
  manifest["id"] = `${manifest.id}-devel`;

  fs.writeFileSync(outFile, JSON.stringify(manifest) + "\n");

  console.log(`Manifest written to ${outFile}!`);
} else {
  
  await esbuild.build({
    entryPoints: ['./src/index.cjs'],
    outfile: './dist/index.js',
    // keepNames: true,
    minify: true,
    treeShaking: true
  })

  const data = fs.readFileSync("./dist/index.js");

  manifest["entrypoint"] = "() => {" + data.toString() + "}"; // treeshaking fuck things up
  
  fs.writeFileSync(outFile, JSON.stringify(manifest));

  console.log(`Manifest written to ${outFile}!`);
}
