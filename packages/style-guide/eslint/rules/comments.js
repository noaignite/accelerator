import eslintConfigComments from '@eslint-community/eslint-plugin-eslint-comments/configs'

export default [
  {
    ...eslintConfigComments.recommended,
    name: '@noaignite/style-guide/comments',
    rules: {
      ...eslintConfigComments.recommended.rules,
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },
]
