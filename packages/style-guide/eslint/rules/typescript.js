import tsdocEslint from 'eslint-plugin-tsdoc'
import tsEslint from 'typescript-eslint'
import constants from './constants.js'

export default [
  ...tsEslint.configs.recommended,
  {
    name: '@noaignite/style-guide/eslint/typescript',
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
      /**
       * Enforce consistent usage of type imports.
       *
       * 🔧 Fixable - https://typescript-eslint.io/rules/consistent-type-imports/
       */
      '@typescript-eslint/consistent-type-imports': 'error',
      /**
       * Disallow duplicate constituents of union or intersection types.
       *
       * 🔧 Fixable - https://typescript-eslint.io/rules/no-duplicate-type-constituents/
       */
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      /**
       * Disallow empty functions.
       *
       * 🚫 Not fixable - https://typescript-eslint.io/rules/no-empty-function/
       */
      '@typescript-eslint/no-empty-function': 'error',
      /**
       * Disallow unused variables.
       *
       * 🚫 Not fixable - https://typescript-eslint.io/rules/no-unused-vars/
       */
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
      /**
       * Enforce non-null assertions over explicit type assertions.
       *
       * 🔧 Fixable - https://typescript-eslint.io/rules/non-nullable-type-assertion-style/
       */
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      /**
       * Enforce using the nullish coalescing operator instead of logical assignments or chaining.
       *
       * 🔧 Fixable - https://typescript-eslint.io/rules/prefer-nullish-coalescing/
       */
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      /**
       * Validates ts-doc comments.
       *
       * 🚫 Not fixable - https://github.com/microsoft/tsdoc
       */
      'tsdoc/syntax': 'error',
    },
  },
]
