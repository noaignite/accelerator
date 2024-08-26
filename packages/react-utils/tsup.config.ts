import { preserveDirectivesPlugin } from '@adamsoderstrom/esbuild-plugin-preserve-directives'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm'],
  bundle: true,
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use strict'],
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
})
