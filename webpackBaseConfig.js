const path = require('path')

// This module is also used as the eslint resolver
module.exports = {
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      '@noaignite/formit': path.join(__dirname, './packages/formit/src'),
      '@noaignite/oui': path.join(__dirname, './packages/oui/src'),
      '@noaignite/utils': path.join(__dirname, './packages/utils/src'),
    },
  },
}
