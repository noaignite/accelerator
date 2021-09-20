const path = require('path')

// This module is also used as the eslint resolver
module.exports = {
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      '@oakwood/formit': path.join(__dirname, './packages/formit/src'),
      '@oakwood/oui': path.join(__dirname, './packages/oui/src'),
      '@oakwood/oui-utils': path.join(__dirname, './packages/oui-utils/src'),
    },
  },
}
