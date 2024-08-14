import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm'],
  bundle: false, // NOTE: Disable `bundle` as this causes issues with the 'use client' directive.
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
})
