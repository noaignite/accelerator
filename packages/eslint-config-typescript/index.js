// Fix eslint shareable config (https://github.com/eslint/eslint/issues/3458)
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    // typescript-eslint specific options
    warnOnUnsupportedTypeScriptVersion: true,
  },
  extends: [
    '@noaignite/eslint-config',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript',
    'prettier',
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  // If adding a typescript-eslint version of an existing ESLint rule,
  // make sure to disable the ESLint rule here.
  rules: {
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: { '{}': false },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-var-requires': 'off',

    // doesn't play well with importing TS types as devDependencies
    'import/no-extraneous-dependencies': 'off',
    // disabled type-aware linting due to performance considerations
    '@typescript-eslint/dot-notation': 'off',
    'dot-notation': 'error',
    // disabled type-aware linting due to performance considerations
    '@typescript-eslint/no-implied-eval': 'off',
    'no-implied-eval': 'error',
    // disabled type-aware linting due to performance considerations
    '@typescript-eslint/no-throw-literal': 'off',
    'no-throw-literal': 'error',
    // disabled type-aware linting due to performance considerations
    '@typescript-eslint/return-await': 'off',
    'no-return-await': 'error',
    // this rule doesn't seem to work with the typescript recommended rules
    'import/extensions': 'off',
    // use typescript no-use-before-define instead of eslint default
    'no-use-before-define': 'off',
    // allow default export
    'no-restricted-exports': 'off',

    // In tests this is generally intended.
    'react/button-has-type': 'off',
    // They are accessed to test custom validator implementation with PropTypes.checkPropTypes
    'react/forbid-foreign-prop-types': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    // components that are defined in test are isolated enough
    // that they don't need type-checking
    'react/no-unused-prop-types': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
  },
}
