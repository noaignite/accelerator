import { defineConfig } from 'tsdown'
import { getTsdownConfig } from '../../scripts/getTsdownConfig'

export default defineConfig(
  getTsdownConfig({
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.*'],
    format: ['cjs', 'esm'],
    outExtensions: ({ format }) => ({
      js: format === 'cjs' ? '.cjs' : '.js',
      dts: format === 'cjs' ? '.d.cts' : '.d.ts',
    }),
  }),
)
