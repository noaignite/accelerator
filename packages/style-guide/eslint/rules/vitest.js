import vitest from '@vitest/eslint-plugin'
import constants from './constants.js'

export default [
  {
    name: '@noaignite/style-guide/eslint/vitest',
    files: constants.TEST_FILES,
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
