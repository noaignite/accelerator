import { defineConfig } from 'tsup'
import { getTsupConfig } from '../../scripts/getTsupConfig'

export default defineConfig(
  getTsupConfig({
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.*'],
    format: ['esm'],
  }),
)
