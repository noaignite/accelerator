import baseConfig from './base.js'

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  ...baseConfig,
  // Include the Tailwind configuration file.
  tailwindConfig: './packages/tailwind-config/src/tailwind.config.ts',
  // Allow `prettier-plugin-tailwindcss` to run for these functions.
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  // Include Prettier plugins. Include order matters.
  plugins: [
    ...baseConfig.plugins,
    'prettier-plugin-tailwindcss', // MUST come last.
  ],
}
