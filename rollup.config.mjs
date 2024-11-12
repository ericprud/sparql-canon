import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"
import { nodeResolve } from '@rollup/plugin-node-resolve';

const bundle = (config) => ({
  ...config,
  input: "src/main.ts",
  external: (id) => !/^[./]/.test(id),
})

export default [
  /*
  bundle({
    plugins: [esbuild()],
    output: [
      {
        dir: "dist",
        format: "es",
        exports: "named",
        preserveModules: true,
        sourcemap: true
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      dir: "dist",
      format: "es",
      exports: "named",
      preserveModules: true,
      sourcemap: true
    },
  }),
  */
  bundle({
    plugins: [
      esbuild(),
      nodeResolve({
        // use "jsnext:main" if possible
        // see https://github.com/rollup/rollup/wiki/jsnext:main
        jsnext: true,
        // use "module" field for ES6 module if possible
        module: true, // Default: true

        // use "jsnext:main" if possible
        // – see https://github.com/rollup/rollup/wiki/jsnext:main
        jsnext: true,  // Default: false

        // use "main" field or index.js, even if it's not an ES6 module
        // (needs to be converted from CommonJS to ES6
        // – see https://github.com/rollup/rollup-plugin-commonjs
        main: true,  // Default: true

        // if there's something your bundle requires that you DON'T
        // want to include, add it to 'skip'. Local and relative imports
        // can be skipped by giving the full filepath. E.g.,
        // `path.resolve('src/relative-dependency.js')`
        // skip: [ ],  // Default: []

        // some package.json files have a `browser` field which
        // specifies alternative files to load for people bundling
        // for the browser. If that's you, use this option, otherwise
        // pkg.browser will be ignored
        browser: true,  // Default: false

        // not all files you want to resolve are .js files
        extensions: [ '.js', '.json' ],  // Default: ['.js']

        // whether to prefer built-in modules (e.g. `fs`, `path`) or
        // local ones with the same names
        preferBuiltins: false,  // Default: true

        // Lock the module search in this path (like a chroot). Module defined
        // outside this path will be mark has external
        // jail: '/my/jail/path', // Default: '/'

        // Any additional options that should be passed through
        // to node-resolve
        // customResolveOptions: {
        //   moduleDirectories: ['node_modules']
        // }

      })
    ],
    output: [
      {
        dir: "build",
        format: "cjs",
        exports: "named",
        preserveModules: false,
        sourcemap: true
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      dir: "build",
      format: "es",
      exports: "named",
      preserveModules: false,
      sourcemap: true
    },
  }),
]
