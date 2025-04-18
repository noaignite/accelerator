import tsdocEslint from 'eslint-plugin-tsdoc'
import tsEslint from 'typescript-eslint'
import constants from './constants.js'

export default [
  ...tsEslint.configs.recommended,
  {
    name: '@noaignite/style-guide/typescript',
    files: constants.TYPESCRIPT_FILES,
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      tsdoc: tsdocEslint,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: false,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      'tsdoc/syntax': 'error',
    },
  },
]
