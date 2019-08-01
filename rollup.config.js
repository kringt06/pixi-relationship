import babel from "rollup-plugin-babel"
import buble from "rollup-plugin-buble"
import resolve from "rollup-plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import commonjs from "rollup-plugin-commonjs"
import builtins from "rollup-plugin-node-builtins"
import url from "rollup-plugin-url"
import alias from "rollup-plugin-alias"
import path from "path"

import pkg from "./package.json"

const plugins = [
  builtins(),
  url({
    limit: 20 * 1024, // inline files < 20k, copy files > 20k
    include: [/.(png|jpg|svg|gif)$/],
    fileName: "[dirname][hash][extname]",
    publicPath: `${pkg.name}/public/`
  }),
  alias({
    resolve: ["", ".js", "/index.js"],
    "@": path.resolve(__dirname, "src"),
    [`${pkg.name}/public`]: path.resolve(__dirname, "public")
  }),
  babel({
    babelrc: false,
    exclude: ["node_modules/**"],
    plugins: [
      [
        "@babel/plugin-proposal-class-properties",
        {
          loose: true
        }
      ]
    ]
  }),
  resolve(),
  commonjs({
    namedExports: {
      "resource-loader": ["Resource"]
    }
  }),
  buble()
]

if (process.env.NODE_ENV === "production") {
  plugins.push(terser())
}

const globals = {
  "pixi.js": "PIXI",
  "pixi-viewport": "pixi-viewport",
  "pixi-layers": "pixi-layers",
  "lodash/debounce": "lodash/debounce"
}

const external = Object.keys(globals)

export default [
  {
    external,
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs", globals },
      { file: pkg.module, format: "es", globals }
    ],
    plugins,
    globals
  }
]
