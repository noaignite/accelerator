import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import bestPracticeConfig from './rules/best-practice.js'
import commentsConfig from './rules/comments.js'
import es6Config from './rules/es6.js'
import importConfig from './rules/import.js'
import possibleErrorsConfig from './rules/possible-errors.js'
import stylisticConfig from './rules/stylistic.js'
import turboConfig from './rules/turbo.js'
import typescriptConfig from './rules/typescript.js'
import unicornConfig from './rules/unicorn.js'
import vitestConfig from './rules/vitest.js'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    name: '@noaignite/style-guide/ignores',
    ignores: ['node_modules', 'build', 'dist', 'coverage', '.turbo', '*.map', '*.min.js', '*.snap'],
  },
  {
    name: '@eslint/js/configs/recommended',
    ...js.configs.recommended,
  },
  {
    name: 'eslint-config-prettier',
    ...eslintConfigPrettier,
  },
  ...typescriptConfig,
  ...bestPracticeConfig,
  ...possibleErrorsConfig,
  ...es6Config,
  ...stylisticConfig,
  ...unicornConfig,
  ...commentsConfig,
  ...importConfig,
  ...turboConfig,
  ...vitestConfig,
]
