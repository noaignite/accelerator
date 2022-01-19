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
  ],
}
