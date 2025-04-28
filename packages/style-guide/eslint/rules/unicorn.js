// Based on https://github.com/vercel/style-guide/blob/canary/eslint/rules/unicorn.js
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [
  {
    name: '@noaignite/style-guide/eslint/unicorn',
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      // TODO: Consider enabling more rules.
      // ...eslintPluginUnicorn.configs.recommended.rules,
      /**
       * Require using the `node:` protocol when importing Node.js built-in modules.
       *
       * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
       */
      'unicorn/prefer-node-protocol': 'warn',
    },
  },
]
