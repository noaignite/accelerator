import eslintConfigComments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import tsEslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  eslintConfigComments.recommended,
  ...tsEslint.configs.recommended,
  {
    ...importPlugin.flatConfigs.recommended,
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  {
    rules: {
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      '@eslint-community/eslint-comments/require-description': 'error',

      'lines-around-directive': ['error', 'always'], // Enable & let prettier format.
      'no-alert': 'error',
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }], // Allow warn and error logs.
      eqeqeq: 'error',
    },
  },
]
