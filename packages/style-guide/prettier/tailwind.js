import baseConfig from './base.js'

// Resolve plugin paths here because pnpm does not expose this package's
// dependencies to the consuming project's Prettier configuration.
const plugins = [
  // Include order matters.
  ...baseConfig.plugins,
  import.meta.resolve('prettier-plugin-tailwindcss'), // MUST come last
]

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
  plugins,
}
