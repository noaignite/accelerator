import { includeIgnoreFile } from '@eslint/compat'
import baseConfig from '@noaignite/style-guide/eslint/base'
import turboConfig from '@noaignite/style-guide/eslint/turbo'
import typescriptConfig from '@noaignite/style-guide/eslint/typescript'
import vitestConfig from '@noaignite/style-guide/eslint/vitest'
import { resolve } from 'node:path'

const gitignorePath = resolve(import.meta.dirname, '../..', '.gitignore')

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  includeIgnoreFile(gitignorePath),
  ...baseConfig,
  ...turboConfig,
  ...typescriptConfig,
  ...vitestConfig,
]
