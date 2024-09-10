import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  bundle: false, // TODO: Do we even need to bundle a mock package?
  clean: true,
  dts: true,
  minify: false, // TODO: Do we even need minify a mock package?
  sourcemap: false, // TODO: Do we even need sourcemaps for a mock package?
})
