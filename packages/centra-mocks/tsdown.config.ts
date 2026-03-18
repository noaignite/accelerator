import { defineConfig } from 'tsdown'
import { getTsdownConfig } from '../../scripts/getTsdownConfig'

export default defineConfig(
  getTsdownConfig({
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.*'],
  }),
)
