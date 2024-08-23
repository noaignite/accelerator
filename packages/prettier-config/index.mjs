import vercelPrettierConfig from '@vercel/style-guide/prettier'

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  ...vercelPrettierConfig,
  // Include Prettier plugins. Include order matters.
  plugins: [
    ...vercelPrettierConfig.plugins,
    'prettier-plugin-style-order',
    'prettier-plugin-organize-imports',
  ],
  // add rules configurations here
  printWidth: 100,
  semi: false,
}
