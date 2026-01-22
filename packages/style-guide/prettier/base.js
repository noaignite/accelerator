/**
 * Some of Prettier's defaults can be overridden by an EditorConfig file. We
 * define those here to ensure that doesn't happen.
 *
 * See: https://github.com/prettier/prettier/blob/main/docs/configuration.md#editorconfig
 */
const overridableDefaults = {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 100,
  useTabs: false,
}

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  ...overridableDefaults,
  semi: false,
  singleQuote: true,
  // Include Prettier plugins. Include order matters.
  plugins: [
    'prettier-plugin-packagejson',
    'prettier-plugin-css-order',
    'prettier-plugin-organize-imports',
  ],
}
