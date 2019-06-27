import babel from "rollup-plugin-babel";
import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "rollup-plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";

import pkg from "./package.json";

const plugins = [
  builtins(),
  resolve(),
  babel({
    babelrc: false,
    exclude: ["node_modules/**"]
  }),
  commonjs({
    namedExports: {
      "resource-loader": ["Resource"]
    }
  }),
  buble()
];

if (process.env.NODE_ENV === "production") {
  plugins.push(terser());
}

const globals = {
  "pixi.js": "PIXI",
  "@pixi/core": "PIXI",
  "@pixi/settings": "PIXI",
  "@pixi/math": "PIXI",
  "@pixi/utils": "PIXI.utils",
  "@pixi/filter-alpha": "PIXI.filters",
  "@pixi/filter-blur": "PIXI.filters",
  "@pixi/constants": "PIXI",
  "@pixi/display": "PIXI",
  "@pixi/runner": "PIXI"
};

const external = Object.keys(globals);

export default [
  {
    external,
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs", globals },
      { file: pkg.module, format: "es", globals }
    ],
    plugins
  }
];
