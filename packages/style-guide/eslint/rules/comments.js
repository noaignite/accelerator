import eslintConfigComments from '@eslint-community/eslint-plugin-eslint-comments/configs'

export default [
  {
    ...eslintConfigComments.recommended,
    name: '@noaignite/style-guide/comments',
    rules: {
      ...eslintConfigComments.recommended.rules,
      /**
       * This rule warns eslint-disable directive-comments if the eslint-enable
       * directive-comment for that does not exist.
       *
       * 🚫 Not fixable - https://github.com/mysticatea/eslint-plugin-eslint-comments/blob/master/docs/rules/disable-enable-pair.md
       */
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      /**
       * This rule warns directive comments without description.
       *
       * 🚫 Not fixable - https://github.com/mysticatea/eslint-plugin-eslint-comments/blob/master/docs/rules/require-description.md
       */
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },
]
