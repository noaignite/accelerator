import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import tsdocEslint from 'eslint-plugin-tsdoc'
import turboPlugin from 'eslint-plugin-turbo'
import globals from 'globals'
import { resolve } from 'node:path'
import tsEslint from 'typescript-eslint'

const gitignorePath = resolve(import.meta.dirname, '../..', '.gitignore')

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  // Ignore files
  includeIgnoreFile(gitignorePath),
  // Base config
  js.configs.recommended,
  eslintConfigPrettier,
  ...tsEslint.configs.recommended,
  {
    ...importPlugin.flatConfigs.recommended,
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  // Global config
  {
    rules: {
      'lines-around-directive': ['error', 'always'], // Enable & let prettier format.
      'no-alert': 'error',
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }], // Allow warn and error logs.
      eqeqeq: 'error',
    },
  },
  // Turbo config
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  // Config files
  {
    files: ['**/*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Typescript files
  {
    files: ['**/*.ts', '**/*.tsx'],
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
  // Vitest test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/no-empty-function': 'off',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
]
