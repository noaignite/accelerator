import { defineConfig } from 'tsup'

export default defineConfig({
  dts: true,
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  minify: true,
  sourcemap: true,
  clean: true,
})
