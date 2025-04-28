import globals from 'globals'

export default [
  {
    name: '@noaignite/style-guide/eslint/node',
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
