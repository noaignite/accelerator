import type { ViteUserConfig } from 'vitest/config'

type Options = ViteUserConfig

export function getVitestConfig(options: Options): Options {
  const { test, ...rest } = options

  return {
    test: {
      globals: true,
      environment: 'jsdom',
      ...test,
    },
    ...rest,
  }
}
