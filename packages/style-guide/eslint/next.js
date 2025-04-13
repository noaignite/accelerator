import reactConfig from './react.js'
import nextConfig from './rules/next.js'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [...reactConfig, ...nextConfig]
