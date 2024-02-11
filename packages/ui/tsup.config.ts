import { defineConfig, type Options } from 'tsup'
import stylexPlugin from '@stylexjs/esbuild-plugin'
import path from 'path'

export default defineConfig((options: Options) => ({
  // Build react package for use in nextjs 13
  // https://github.com/egoist/tsup/issues/835
  esbuildOptions(internalOptions) {
    internalOptions.write = true // To allow StyleX to write CSS files.
    internalOptions.banner = {
      js: '"use client"',
    }
  },
  treeshake: false, // Enabling this removes client directives.
  splitting: false,
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  external: ['react'],
  esbuildPlugins: [
    stylexPlugin({
      // If set to 'true', bundler will inject styles in-line
      // Do not use in production
      dev: false,
      // Required. File path for the generated CSS file
      generatedCSSFileName: path.resolve(__dirname, 'dist/index.css'),
      // Aliases for StyleX package imports
      // default: '@stylexjs/stylex'
      stylexImports: ['@stylexjs/stylex'],
      // Required for CSS variable support
      unstable_moduleResolution: {
        // type: 'commonJS' | 'ESModules' | 'haste'
        // default: 'commonJS'
        type: 'commonJS',
        // The absolute path to the root of your project
        rootDir: __dirname,
      },
    }),
  ],
  ...options,
}))
