import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'
import type { Options as TsupOptions } from 'tsup'

type Options = TsupOptions & {
  entry: TsupOptions['entry'] // Required.
}

export function getTsupConfig(options: Options): Options {
  return {
    format: ['cjs', 'esm'],
    clean: true,
    dts: true,
    sourcemap: true,
    target: 'esnext',
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: 'js' })],
    ...options,
  }
}
