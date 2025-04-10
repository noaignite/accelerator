import turboPlugin from 'eslint-plugin-turbo'

export default [
  {
    name: '@noaignite/style-guide/turbo',
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
]
