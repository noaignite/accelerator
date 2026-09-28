import { defineConfig } from 'tsdown'
import { getTsdownConfig } from '../../scripts/getTsdownConfig'

export default defineConfig(
  getTsdownConfig({
    entry: ['src/index.ts'],
    deps: {
      neverBundle: ['react'],
    },
  }),
)
