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
    'prettier-plugin-tailwindcss', // MUST come last.
  ],
  // Include the Tailwind configuration file.
  tailwindConfig: './packages/tailwind-config/tailwind.config.ts',
  // Allow `prettier-plugin-tailwindcss` to run for these functions.
  tailwindFunctions: ['clsx', 'cn'],
  // Add other rules configurations below.
}
