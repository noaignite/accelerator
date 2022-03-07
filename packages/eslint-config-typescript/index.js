// Fix eslint shareable config (https://github.com/eslint/eslint/issues/3458)
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['@noaignite/eslint-config'],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-typescript',
        'prettier',
      ],
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
      plugins: ['@typescript-eslint/eslint-plugin'],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: {
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
        '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'react/jsx-props-no-spreading': 'off',
        'react/require-default-props': 'off',
        // doesn't play well with importing TS types as devDependencies
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
