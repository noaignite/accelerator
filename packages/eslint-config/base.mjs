import tsParser from '@typescript-eslint/parser'
import tsEslint from 'typescript-eslint'

export default [
  ...tsEslint.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        React: true,
        __DEV__: true,
        global: false,
        jest: false,
        Promise: true
      }
    },
  }
]
