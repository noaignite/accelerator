import importPlugin from 'eslint-plugin-import'
import constants from './constants.js'

export default [
  {
    ...importPlugin.flatConfigs.recommended,
    name: '@noaignite/style-guide/import',
    languageOptions: {
      ...importPlugin.flatConfigs.recommended.languageOptions,
      ecmaVersion: constants.ECMA_VERSION,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      /**
       * Enforces having one or more empty lines after the last top-level
       * import statement or require call.
       *
       * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
       */
      'import/newline-after-import': ['error', { count: 1 }],
    },
  },
]
