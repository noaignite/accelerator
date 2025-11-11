import { fixupPluginRules } from '@eslint/compat'
import jsPlugin from '@eslint/js'
import stylisticPlugin from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import jestPlugin from 'eslint-plugin-jest'
import promisePlugin from 'eslint-plugin-promise'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactNativePlugin from 'eslint-plugin-react-native'
import tsEslint from 'typescript-eslint'

export default [
  jestPlugin.configs['flat/recommended'],
  jsPlugin.configs.recommended,
  promisePlugin.configs['flat/recommended'],
  reactPlugin.configs.flat.recommended,
  ...tsEslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylisticPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': fixupPluginRules(reactNativePlugin),
    },
  },
  {
    files: ['**/*.{js,cjs,ts,jsx,tsx}'],
    settings: { react: { version: 'detect' } },
    languageOptions: {
      parser: tsParser,
      globals: {
        React: true,
        __DEV__: true,
        global: false,
        jest: false,
        Promise: true,
      },
    },
    rules: {
      // PROMISE
      'promise/no-return-wrap': 'off',
      'promise/always-return': 'warn',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'off',
      'promise/avoid-new': 'off',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
      // REACT
      'react-native/no-color-literals': 'warn',
      'react-native/no-unused-styles': 'warn',
      'react-native/no-inline-styles': 'warn',
      // 'react-native/no-raw-text': 'error',
      'react-native/no-single-element-style-arrays': 'warn',
      'react-native/sort-styles:': 0,
      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 2,
      'react/self-closing-comp': 1,
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/jsx-curly-brace-presence': 1,
      'react/no-deprecated': 1,
      'react/no-danger': 2,
      'react/default-props-match-prop-types': 0,
      'react/jsx-no-duplicate-props': 2,
      'react/jsx-key': 2,
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/no-unsafe': 2,
      'react/destructuring-assignment': 0,
      'react/no-did-update-set-state': 2,
      'react/no-did-mount-set-state': 0,
      'react/jsx-closing-bracket-location': 0,
      'react/jsx-handler-names': 0,
      'react/jsx-closing-tag-location': 0,
      'react/no-string-refs': 1,
      'react/display-name': 0,
      // 'react/jsx-no-literals': 2,
      'react/prop-types': [0, { skipUndeclared: true }],
      'react/no-multi-comp': [1, { ignoreStateless: true }],
      'react/no-unused-prop-types': 0,
      // TYPESCRIPT
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-shadow': ['error'],
      '@stylistic/indent': ['warn', 2],
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/jsx-curly-spacing': [2, { when: 'never', children: { when: 'never' } }],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@stylistic/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          caughtErrors: 'none',
          destructuredArrayIgnorePattern: '^_',
          reportUsedIgnorePattern: true,
        },
      ],
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-wrapper-object-types': 0,
      '@typescript-eslint/no-duplicate-enum-values': 0,
      // JEST
      'jest/no-disabled-tests': 0,
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      // REST
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@lckygrp/mobile-*/**',
                '!@lckygrp/mobile-web-services/**',
                '!@lckygrp/mobile-unit-testing/**',
                '!@lckygrp/mobile-core-types/global',
                '!@lckygrp/mobile-code-config/eslint.config.js',
              ],
              message: 'Only imports from index are allowed',
            },
          ],
        },
      ],
      '@stylistic/no-extra-parens': [
        'error',
        'all',
        {
          conditionalAssign: false,
          returnAssign: false,
          nestedBinaryExpressions: false,
          ternaryOperandBinaryExpressions: false,
          enforceForArrowConditionals: false,
          enforceForSequenceExpressions: false,
          enforceForNewInMemberExpressions: false,
          enforceForFunctionPrototypeMethods: false,
        },
      ],
      'no-shadow': 'off',
      'no-undef': 'off',
      '@stylistic/quote-props': 0,
      '@stylistic/multiline-ternary': 0,
      '@stylistic/no-whitespace-before-property': 1,
      '@stylistic/key-spacing': ['warn', { beforeColon: false, afterColon: true, mode: 'strict' }],
      '@stylistic/type-annotation-spacing': 1,
      'no-dupe-class-members': 1,
      'dot-notation': 0,
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      '@stylistic/object-curly-newline': 0,
      '@stylistic/array-bracket-spacing': 1,
      'lines-between-class-members': 1,
      'prefer-const': 0,
      'no-prototype-builtins': 0,
      'no-case-declarations': 1,
      'no-var': 'warn',
      curly: [1, 'all'],
      'sort-keys': [0, 'asc', { caseSensitive: false }],
      'sort-imports': 0,
      'no-console': 2,
      'consistent-return': 2,
      'no-return-assign': 0,
      '@stylistic/max-len': ['warn', 350],
      '@stylistic/semi': ['error', 'never'],
      'space-infix-ops': 1,
      '@stylistic/no-multi-spaces': 1,
      'spaced-comment': 1,
      camelcase: 1,
      '@stylistic/comma-spacing': 1,
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/space-before-blocks': 1,
      'no-self-compare': 1,
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      'no-else-return': ['warn', { allowElseIf: false }],
      'no-nested-ternary': ['warn'],
      'no-empty': 'warn',
      'no-empty-function': 'warn',
      'no-catch-shadow': 'warn',
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/arrow-spacing': 1,
      '@stylistic/block-spacing': ['warn', 'always'],
      '@stylistic/jsx-equals-spacing': [2, 'never'],
      '@stylistic/type-generic-spacing': ['error'],
      /*
      IMPORT (no support for eslint 9)
      'import/no-unresolved': ['error', {caseSensitive: true}],
      */
    },
  },
  {
    files: [
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/__mocks__/**/*.{js,jsx,ts,tsx}',
      '**/scripts/**/*.{js,jsx,ts,tsx}',
    ],
    settings: { react: { version: 'detect' } },
    rules: {
      'no-restricted-syntax': 0,
      '@typescript-eslint/no-unsafe-function-type': 0,
    },
  },
  {
    files: ['**/types/*.{js,jsx,ts,tsx}'],
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/no-unused-vars': 0,
    },
  },
  {
    ignores: ['ios/*', 'android/*', 'node_modules', '.yarn/*', '**/dist/**'],
  },
]
