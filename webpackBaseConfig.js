const path = require('path')

// This module is used by the docs and by eslint-plugin-import.
module.exports = {
  context: path.resolve(__dirname),
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      '@noaignite/formit': path.join(__dirname, './packages/formit/src'),
      '@noaignite/oui': path.join(__dirname, './packages/oui/src'),
      '@noaignite/utils': path.join(__dirname, './packages/utils/src'),
    },
  },
}
