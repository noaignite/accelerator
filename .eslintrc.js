const path = require('path')

module.exports = {
  extends: ['@noaignite/eslint-config'],
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, './webpackBaseConfig.js'),
      },
    },
  },
  overrides: [
    {
      files: ['docs/**/*'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'eslint-plugin-react-hooks'],
      extends: [
        'plugin:import/recommended',
        'airbnb',
        'prettier',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        // this rule doesn't seem to work with the typescript recommended rules
        'import/extensions': 'off',
        // use typescript no-use-before-define instead of eslint default
        'no-use-before-define': 'off',
        // allow default export
        'no-restricted-exports': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      },
    },
  ],
}
