const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */
module.exports = {
  extends: ['@vercel/style-guide/eslint/node', '@vercel/style-guide/eslint/typescript'].map(
    require.resolve,
  ),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  // Add rules configurations here
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off', // Prefer types over interfaces.
    '@typescript-eslint/explicit-function-return-type': 'off', // Allow typescript to infer.
    '@typescript-eslint/restrict-template-expressions': 'off', // Allow template expressions.

    'import/no-default-export': 'off', // Allow default exports.
    'import/no-extraneous-dependencies': [
      'error',
      {
        // Allow imports of `devDependencies` inside test files.
        devDependencies: [
          'test.{ts,tsx}', // repos with a single test file
          'test-*.{ts,tsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/vitest.config.mts', // vitest config
        ],
        optionalDependencies: false,
      },
    ],
    'import/order': 'off', // Disable and let prettier sort imports.

    'unicorn/filename-case': 'off', // Do not enforce kebab-case filenames.

    'lines-around-directive': ['error', 'always'], // Enable & let prettier format.
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }], // Allow warn and error logs.
  },
}