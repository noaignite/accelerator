const babelConfig = require('../babel.config')

const alias = {
  '@oakwood/oui': '../packages/oui/src',
  '@oakwood/oui-utils': '../packages/oui-utils/src',
  docs: './',
}

babelConfig.plugins.push(['babel-plugin-module-resolver', { alias }])

module.exports = babelConfig
