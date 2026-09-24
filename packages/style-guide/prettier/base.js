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

// Resolve plugin paths here because pnpm does not expose this package's
// dependencies to the consuming project's Prettier configuration.
const plugins = [
  // Include order matters.
  'prettier-plugin-packagejson',
  'prettier-plugin-css-order',
  'prettier-plugin-organize-imports',
].map((plugin) => import.meta.resolve(plugin))

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  ...overridableDefaults,
  semi: false,
  singleQuote: true,
  plugins,
}
