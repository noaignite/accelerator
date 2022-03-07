// Fix eslint shareable config (https://github.com/eslint/eslint/issues/3458)
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:import/recommended', 'airbnb', 'prettier'],
  parser: '@babel/eslint-parser',
  plugins: ['eslint-plugin-react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['test/**/*', '*.test.js', '*.test.ts', '*.test.tsx'],
      env: {
        jest: true,
      },
      extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
      rules: {
        'testing-library/render-result-naming-convention': 'off',
      },
    },
  ],
  /**
   * Sorted alphanumerically within each group. built-in and each plugin form
   * their own groups.
   *
   * NOTE: When adding rules here, you need to make sure they are compatible with
   * `typescript-eslint`, as some rules such as `no-array-constructor` aren't compatible.
   */
  rules: {
    // Stylistic opinion
    'arrow-body-style': 'off',
    // Consistency is key
    'consistent-this': ['error', 'self'],
    curly: ['error', 'all'],
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
    // Allow default exports
    'no-restricted-exports': 'off',
    'no-underscore-dangle': 'error',
    'no-use-before-define': ['error', { functions: false }],
    'nonblock-statement-body-position': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    // Destructuring harm grep potential.
    'prefer-destructuring': 'off',

    // Not sure why it doesn't work
    // 'import/named': 'off',
    // Missing yarn workspace support
    'import/no-extraneous-dependencies': 'off',
    // The code is already coupled to webpack. Prefer explicit coupling.
    'import/no-webpack-loader-syntax': 'off',

    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-autofocus': 'off',

    'react-hooks/exhaustive-deps': ['error', { additionalHooks: 'useEnhancedEffect' }],
    'react-hooks/rules-of-hooks': 'error',

    'react/default-props-match-prop-types': [
      'error',
      {
        // Otherwise the rule thinks inner props = outer props
        // But in TypeScript we want to know that a certain prop is defined during render
        // while it can be ommitted from the callsite.
        // Then defaultProps (or default values) will make sure that the prop is defined during render
        allowRequiredDefaults: true,
      },
    ],
    // Can add verbosity to small functions making them harder to grok.
    // Though we have to manually enforce it for function components with default values.
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off', // Too strict, no time for that
    'react/function-component-definition': 'off', // Could this be useful?
    'react/jsx-curly-brace-presence': 'off', // broken
    // airbnb is using .jsx
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.tsx'] }],
    // Prefer <React.Fragment> over <>.
    'react/jsx-fragments': ['error', 'element'],
    // Enforces premature optimization
    'react/jsx-no-bind': 'off',
    // We are a UI library.
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
}
