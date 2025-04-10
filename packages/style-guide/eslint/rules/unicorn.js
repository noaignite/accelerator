// Based on https://github.com/vercel/style-guide/blob/canary/eslint/rules/unicorn.js
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [
  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      /**
       * Require using the `node:` protocol when importing Node.js built-in modules.
       *
       * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
       */
      'unicorn/prefer-node-protocol': 'warn',
    },
  },
]
