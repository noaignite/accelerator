const path = require('path')

const workspaceRoot = path.join(__dirname, '../../')

module.exports = {
  stories: ['../src/**/*stories.js'],
  addons: ['@storybook/addon-toolbars', '@storybook/addon-controls', '@storybook/addon-actions'],
  webpackFinal: async (config /*, { configType }*/) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // required to transpile ../packages/
    config.module.rules = config.module.rules.map((rule) => {
      if (Array.isArray(rule.use) && rule.use[0].loader === 'babel-loader') {
        rule.exclude = /node_modules/
        rule.include = [workspaceRoot]
      }

      return rule
    })

    // Return the altered config
    return config
  },
}
