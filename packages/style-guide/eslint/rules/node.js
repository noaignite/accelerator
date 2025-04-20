import globals from 'globals'

export default [
  {
    name: '@noaignite/style-guide/node',
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
