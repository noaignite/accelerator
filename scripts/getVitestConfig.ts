import type { ViteUserConfig } from 'vitest/config'

type Options = ViteUserConfig

export function getVitestConfig(options: Options): Options {
  const { test, ...rest } = options

  return {
    test: {
      coverage: {
        reporter: ['html', 'json-summary', 'lcov', 'text'],
        include: ['src/**'],
        exclude: ['coverage/**', 'dist/**', '**/*.d.ts'],
      },
      globals: true,
      environment: 'jsdom',
      ...test,
    },
    ...rest,
  }
}
