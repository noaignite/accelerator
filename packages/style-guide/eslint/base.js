import baseConfig from './rules/base.js'
import commentsConfig from './rules/comments.js'
import importConfig from './rules/import.js'
import turboConfig from './rules/turbo.js'
import typescriptConfig from './rules/typescript.js'
import vitestConfig from './rules/vitest.js'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...baseConfig,
  ...commentsConfig,
  ...importConfig,
  ...typescriptConfig,
  ...turboConfig,
  ...vitestConfig,
]
