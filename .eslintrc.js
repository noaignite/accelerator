const path = require('path')

module.exports = {
  root: true, // So parent files don't get applied
  globals: {
    preval: false,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['plugin:import/recommended', 'airbnb', 'prettier', 'prettier/react'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  plugins: ['eslint-plugin-babel', 'eslint-plugin-react-hooks'],
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, './docs/.storybook/webpackBaseConfig.js'),
      },
    },
  },
  /**
   * Sorted alphanumerically within each group. built-in and each plugin form
   * their own groups.
   */
  rules: {
    'arrow-body-style': 'off', // Don't enforce, readability firsthand.
    'consistent-this': ['error', 'self'],
    // just as bad as "max components per file"
    'max-classes-per-file': 'off',
    // Too interruptive
    'no-alert': 'error',
    // Strict, airbnb is using warn; allow warn and error for dev environments
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-param-reassign': 'off', // It's fine.
    'no-constant-condition': 'error',
    // Use the proptype inheritance chain
    'no-prototype-builtins': 'off',
    'no-underscore-dangle': 'error',
    'nonblock-statement-body-position': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    // Destructuring harm grep potential.
    'prefer-destructuring': 'off',

    // Not sure why it doesn't work
    'import/named': 'off',
    // Missing yarn workspace support
    'import/no-extraneous-dependencies': 'off',

    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-autofocus': 'off',

    'react-hooks/exhaustive-deps': ['error', { additionalHooks: 'useEnhancedEffect' }],
    'react-hooks/rules-of-hooks': 'error',

    // Can add verbosity to small functions making them harder to grok.
    // Though we have to manually enforce it for function components with default values.
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off', // Too strict, no time for that
    'react/jsx-curly-brace-presence': 'off', // broken
    // airbnb is using .jsx
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
    'react/jsx-handler-names': [
      'error',
      {
        // airbnb is disabling this rule
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    // This rule is great for raising people awareness of what a key is and how it works.
    'react/no-array-index-key': 'off',
    'react/no-danger': 'error',
    'react/no-direct-mutation-state': 'error',
    // Not always relevant
    'react/require-default-props': 'off',
    // This depends entirely on what you're doing. There's no universal pattern
    'react/state-in-constructor': 'off',
    // stylistic opinion. For conditional assignment we want it outside, otherwise as static
    'react/static-property-placement': 'off',
  },
  overrides: [
    {
      files: ['test/**/*.js', '*.test.js'],
      env: {
        jest: true,
      },
      extends: ['plugin:testing-library/recommended', 'plugin:jest-dom/recommended'],
    },
    {
      files: ['docs/src/**/*.js'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
}
