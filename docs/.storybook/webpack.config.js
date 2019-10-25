const path = require('path')

const workspaceRoot = path.join(__dirname, '../../')

module.exports = async props => {
  // add storybook related webpack config here
  const { config } = props

  // required to transpile ../packages/
  config.module.rules = config.module.rules.map(rule => {
    if (Array.isArray(rule.use) && rule.use[0].loader === 'babel-loader') {
      rule.exclude = /node_modules/
      rule.include = [workspaceRoot]
    }

    return rule
  })

  return config
}
