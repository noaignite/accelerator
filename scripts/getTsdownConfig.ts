import type { UserConfig } from 'tsdown'

type Options = UserConfig & {
  entry: NonNullable<UserConfig['entry']>
}

export function getTsdownConfig(options: Options): Options {
  return {
    format: ['cjs', 'esm'],
    clean: true,
    dts: true,
    root: 'src',
    sourcemap: true,
    target: 'esnext',
    unbundle: true,
    outExtensions: ({ format }) => ({
      js: format === 'cjs' ? '.cjs' : '.js',
      dts: format === 'cjs' ? '.d.cts' : '.d.ts',
    }),
    ...options,
  }
}
