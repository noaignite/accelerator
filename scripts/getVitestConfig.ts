import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { ViteUserConfig } from 'vitest/config'

type Options = ViteUserConfig

export function getVitestConfig(options: Options): Options {
  const { resolve: resolveOptions, test, ...rest } = options
  const packageDir = process.cwd()
  const { name } = JSON.parse(readFileSync(resolve(packageDir, 'package.json'), 'utf8')) as {
    name: string
  }

  return {
    resolve: {
      ...resolveOptions,
      alias: {
        [name]: resolve(packageDir, 'src/index.ts'),
        ...resolveOptions?.alias,
      },
    },
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
