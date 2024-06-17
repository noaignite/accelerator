const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */
module.exports = {
  extends: [
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/react',
    '@vercel/style-guide/eslint/next',
    'eslint-config-turbo',
  ].map(require.resolve),
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
  // add rules configurations here
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off', // Prefer types over interfaces.
    '@typescript-eslint/explicit-function-return-type': 'off', // Allow typescript to infer.
    '@typescript-eslint/restrict-template-expressions': 'off', // Allow template expressions.

    'import/no-default-export': 'off', // Allow default exports.
    'import/order': 'off', // Disable and let prettier sort imports.

    'react/jsx-no-leaked-render': 'off', // Allow `&&` conditionals in JSX.
    'react/jsx-sort-props': 'warn', // Standardize prop sorting.
    'react/no-array-index-key': 'off', // This rule is great for raising people awareness of what a key is and how it works.

    'unicorn/filename-case': 'off', // Do no enforce kebab-case filenames.

    'lines-around-directive': ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }], // Allow warn and error logs.
    camelcase: ['error', { allow: ['i18n_'] }],
  },
};
