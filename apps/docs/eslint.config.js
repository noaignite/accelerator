import nextConfig from '@noaignite/style-guide/eslint/next'

export default [
  ...nextConfig,
  {
    ignores: ['public'],
  },
]
