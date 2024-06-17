const vercelPrettierConfig = require('@vercel/style-guide/prettier')

/** @type {import("prettier").Config} */
module.exports = {
  ...vercelPrettierConfig,
  // Include Prettier plugins. Include order matters.
  plugins: [
    ...vercelPrettierConfig.plugins,
    'prettier-plugin-style-order',
    'prettier-plugin-organize-imports',
  ],
  // add rules configurations here
  printWidth: 100,
}
