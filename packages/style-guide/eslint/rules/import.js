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
  },
]
