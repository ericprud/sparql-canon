import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"

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
    plugins: [esbuild()],
    output: [
      {
        dir: "build",
        format: "es",
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
