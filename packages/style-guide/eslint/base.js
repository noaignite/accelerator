import bestPracticeConfig from './rules/best-practice.js'
import commentsConfig from './rules/comments.js'
import es6Config from './rules/es6.js'
import ignoresConfig from './rules/ignores.js'
import importConfig from './rules/import.js'
import javascriptConfig from './rules/javascript.js'
import nodeConfig from './rules/node.js'
import possibleErrorsConfig from './rules/possible-errors.js'
import prettierConfig from './rules/prettier.js'
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
  ...ignoresConfig,
  ...javascriptConfig,
  ...nodeConfig,
  ...prettierConfig,
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
