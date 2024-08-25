import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm'],
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
})
