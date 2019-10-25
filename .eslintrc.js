const path = require('path');

module.exports = {
  root: true, // So parent files don't get applied
  globals: {
    preval: false,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
  },
  extends: ['plugin:import/recommended', 'airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  plugins: ['babel', 'react-hooks'],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  /**
   * Sorted alphanumerically within each group. built-in and each plugin form
   * their own groups.
   */
  rules: {
    'arrow-body-style': 'off', // Don't enforce, readability firsthand.
    'consistent-this': ['error', 'self'],
    'global-require': 'off', // We are building a SSR application.
    'no-alert': 'error',
    // Strict, airbnb is using warn; allow warn and error for dev environments
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-constant-condition': 'error',
    // Airbnb use error
    'no-param-reassign': 'off',
    'no-prototype-builtins': 'off',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-destructuring': 'off', // Destructuring harm grep potential.

    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off', // deprecated
    'jsx-a11y/no-autofocus': 'off',

    // This rule is great for raising people awareness of what a key is and how it works.
    'react/no-array-index-key': 'off',
    'react/destructuring-assignment': 'off',
    // It's buggy
    'react/forbid-prop-types': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }], // airbnb is using .jsx
    'react/jsx-handler-names': [
      'error',
      {
        // airbnb is disabling this rule
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/no-danger': 'error',
    // Strict, airbnb is using off
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'off',
    'react/no-multi-comp': 'off',
    'react/require-default-props': 'off',
    'react/sort-prop-types': 'off',

    'import/namespace': ['error', { allowComputed: true }],
    'import/no-extraneous-dependencies': 'off', // It would be better to enable this rule.
    'import/order': [
      'error',
      {
        groups: [['index', 'sibling', 'parent', 'internal', 'external', 'builtin']],
        'newlines-between': 'never',
      },
    ],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
};