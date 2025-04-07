import eslintConfigComments from '@eslint-community/eslint-plugin-eslint-comments/configs'

export default [
  eslintConfigComments.recommended,
  {
    rules: {
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },
]
