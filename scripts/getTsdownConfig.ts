import type { UserConfig } from 'tsdown'

type Options = UserConfig & {
  entry: NonNullable<UserConfig['entry']>
}

export function getTsdownConfig(options: Options): Options {
  return {
    format: ['esm'],
    clean: true,
    dts: true,
    root: 'src',
    sourcemap: true,
    target: 'esnext',
    unbundle: true,
    outExtensions: () => ({
      js: '.js',
      dts: '.d.ts',
    }),
    ...options,
  }
}
