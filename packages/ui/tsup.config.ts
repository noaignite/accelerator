import { defineConfig, type Options } from 'tsup'
// import CssModulesPlugin from "esbuild-css-modules-plugin";
import fsPromises from 'fs/promises'
// @ts-expect-error -- Is there a better way to import below as a `module`?
import { generateScopedName } from 'hash-css-selector'
import path from 'path'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'

export default defineConfig((options: Options) => ({
  // Build react package for use in nextjs 13
  // https://github.com/egoist/tsup/issues/835
  esbuildOptions(internalOptions) {
    internalOptions.banner = {
      js: '"use client"',
    }
  },
  treeshake: false, // Enabling this removes client directives.
  splitting: false,
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  loader: {
    '.css': 'local-css',
  },
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  external: ['react'],
  // esbuildPlugins: [
  //   CssModulesPlugin({
  //     // @see https://github.com/indooorsman/esbuild-css-modules-plugin/blob/main/index.d.ts for more details
  //     force: true,
  //     emitDeclarationFile: true,
  //     localsConvention: "camelCaseOnly",
  //     namedExports: true,
  //     inject: false,
  //     // tsconfig: "tsconfig.json",
  //     // outdir: "dist",
  //   }),
  // ],
  // [Wanted] Support CSS module
  // https://github.com/egoist/tsup/issues/536
  esbuildPlugins: [
    {
      name: 'css-module',
      setup(build): void {
        build.onResolve({ filter: /\.module\.css$/, namespace: 'file' }, (args) => {
          return {
            path: `${args.path}#css-module`,
            namespace: 'css-module',
            pluginData: {
              pathDir: path.join(args.resolveDir, args.path),
            },
          }
        })
        build.onLoad({ filter: /#css-module$/, namespace: 'css-module' }, async (args) => {
          const { pluginData } = args as {
            pluginData: { pathDir: string }
          }

          const source = await fsPromises.readFile(pluginData.pathDir, 'utf8')

          let cssModule: any = {}
          const result = await postcss([
            postcssModules({
              generateScopedName: function(name, filename) {
                const newSelector = generateScopedName(name, filename)
                cssModule[name] = newSelector

                return newSelector
              },
              getJSON: () => { },
              scopeBehaviour: 'local',
            }),
          ]).process(source, { from: pluginData.pathDir })

          return {
            pluginData: { css: result.css },
            contents: `import "${pluginData.pathDir}"; export default ${JSON.stringify(cssModule)}`,
          }
        })
        build.onResolve({ filter: /\.module\.css$/, namespace: 'css-module' }, (args) => ({
          path: path.join(args.resolveDir, args.path, '#css-module-data'),
          namespace: 'css-module',
          pluginData: args.pluginData as { css: string },
        }))
        build.onLoad({ filter: /#css-module-data$/, namespace: 'css-module' }, (args) => ({
          contents: (args.pluginData as { css: string }).css,
          loader: 'css',
        }))
      },
    },
  ],
  ...options,
}))
