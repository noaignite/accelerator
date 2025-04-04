/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  // Include Prettier plugins. Include order matters.
  plugins: [
    'prettier-plugin-packagejson',
    'prettier-plugin-style-order',
    'prettier-plugin-organize-imports',
  ],
  // Add rules configurations here
  endOfLine: 'lf',
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
}
