import pluginNext from '@next/eslint-plugin-next'

export default [
  {
    name: '@noaignite/style-guide/next',
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
]
