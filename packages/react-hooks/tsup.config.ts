// @ts-expect-error - TODO: Create PR & remove `type: "module"` at https://github.com/Seojunhwan/esbuild-plugin-preserve-directives
import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm'],
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use strict'],
      // eslint-disable-next-line prefer-named-capture-group -- Is this a necessary rule?
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
})
