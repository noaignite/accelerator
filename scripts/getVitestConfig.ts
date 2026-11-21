import { mergeConfig, type ViteUserConfig } from 'vitest/config'

type Options = ViteUserConfig

export function getVitestConfig(options: Options): Options {
  return mergeConfig(
    {
      resolve: {
        tsconfigPaths: true,
      },
      test: {
        coverage: {
          reporter: ['html', 'json-summary', 'lcov', 'text'],
          include: ['src/**'],
          exclude: ['coverage/**', 'dist/**', '**/*.d.ts'],
        },
        globals: true,
        environment: 'jsdom',
        pool: 'threads',
      },
    },
    options,
  )
}
// Temporary CI validation #907/#913: inert shared-input probe.
