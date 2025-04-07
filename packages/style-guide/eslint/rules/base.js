import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import tsEslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules', 'build', 'dist', 'coverage', '.turbo', '*.map', '*.min.js', '*.snap'],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tsEslint.configs.recommended,
  {
    rules: {
      'lines-around-directive': ['error', 'always'], // Enable & let prettier format.
      'no-alert': 'error',
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }], // Allow warn and error logs.
      eqeqeq: 'error',
    },
  },
]
