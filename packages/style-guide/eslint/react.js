import baseConfig from './base.js'
import reactConfig from './rules/react.js'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [...baseConfig, ...reactConfig]
