const path = require('path')

const workspaceRoot = path.join(__dirname, '../../')

// This module is also used as the eslint resolver
module.exports = {
  resolve: {
    modules: [workspaceRoot, 'node_modules'],
    alias: {
      '@oakwood/oui': path.join(workspaceRoot, './packages/oui/src'),
      '@oakwood/oui-utils': path.join(workspaceRoot, './packages/oui-utils/src'),
    },
  },
}
