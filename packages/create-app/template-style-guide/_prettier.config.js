import prettierConfig from '@noaignite/style-guide/prettier'

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  ...prettierConfig,
  // Include Prettier plugins. Include order matters.
  plugins: [
    ...prettierConfig.plugins,
    'prettier-plugin-tailwindcss', // MUST come last.
  ],
  // Include the Tailwind configuration file.
  tailwindConfig: './packages/tailwind-config/tailwind.config.ts',
  // Allow `prettier-plugin-tailwindcss` to run for these functions.
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  // Add other rules configurations below.
}
