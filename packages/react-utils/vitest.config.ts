import { defineConfig } from 'vitest/config'
import { getVitestConfig } from '../../scripts/getVitestConfig'

export default defineConfig(
  getVitestConfig({
    test: {
      setupFiles: ['./vitest.setup.ts'],
    },
  }),
)
