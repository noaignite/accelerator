const deepmerge = require('@material-ui/utils/deepmerge').default
const webpackBaseConfig = require('./webpackBaseConfig')

module.exports = {
  stories: ['../src/**/*stories.js'],
  addons: ['@storybook/addon-controls', '@storybook/addon-actions', '@storybook/addon-a11y'],
  webpackFinal: async (config /*, { configType }*/) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config = deepmerge(config, webpackBaseConfig)

    // Return the altered config
    return config
  },
}
