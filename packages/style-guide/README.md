# @noaignite/style-guide

Style Guide - Configuration files for eslint, prettier & typescript by NoA Ignite.

## Installation

Style Guide is available as an [npm package](https://www.npmjs.com/package/@noaignite/style-guide).

```sh
// with pnpm
pnpm add @noaignite/style-guide

// with yarn
yarn add @noaignite/style-guide

// with npm
npm install @noaignite/style-guide
```

## Usage

### ESLint Configuration

The package provides several ESLint configurations that you can extend in your project:

```js
// eslint.config.js
import baseConfig from '@noaignite/style-guide/eslint/base'

export default {
  ...baseConfig,
  // Your custom rules
}
```

Available configurations:

- `@noaignite/style-guide/eslint/base` - Base configuration
- `@noaignite/style-guide/eslint/react` - For React projects
- `@noaignite/style-guide/eslint/next` - For Next.js projects

### Composing Custom Rule Sets

You can also compose your own configuration by importing specific rule sets:

```js
// eslint.config.js
import ignoresConfig from '@noaignite/style-guide/eslint/rules/ignores'
import javascriptConfig from '@noaignite/style-guide/eslint/rules/javascript'
import prettierConfig from '@noaignite/style-guide/eslint/rules/prettier'
import importConfig from '@noaignite/style-guide/eslint/rules/import'
import typescriptConfig from '@noaignite/style-guide/eslint/rules/typescript'

// Only include the rule sets you need
export default [
  ...ignoresConfig,
  ...javascriptConfig,
  ...prettierConfig,
  ...typescriptConfig,
  ...importConfig,
  // Your custom rules
]
```

Available rule sets:

- `@noaignite/style-guide/eslint/rules/best-practice` - ESLint best practice rules
- `@noaignite/style-guide/eslint/rules/comments` - ESLint comments rules
- `@noaignite/style-guide/eslint/rules/es6` - ESLint ES6 rules
- `@noaignite/style-guide/eslint/rules/ignores` - ESLint ignores rules
- `@noaignite/style-guide/eslint/rules/import` - ESLint import rules
- `@noaignite/style-guide/eslint/rules/javascript` - ESLint JavaScript rules
- `@noaignite/style-guide/eslint/rules/next` - Next.js specific rules
- `@noaignite/style-guide/eslint/rules/possible-errors` - ESLint possible errors rules
- `@noaignite/style-guide/eslint/rules/prettier` - ESLint Prettier integration rules
- `@noaignite/style-guide/eslint/rules/react` - ESLint React specific rules
- `@noaignite/style-guide/eslint/rules/stylistic` - ESLint stylistic rules
- `@noaignite/style-guide/eslint/rules/turbo` - Turborepo specific rules
- `@noaignite/style-guide/eslint/rules/typescript` - ESLint TypeScript rules
- `@noaignite/style-guide/eslint/rules/unicorn` - ESLint Unicorn rules
- `@noaignite/style-guide/eslint/rules/vitest` - Vitest specific rules

### Prettier Configuration

The package provides several Prettier configurations that you can extend in your project:

```js
// prettier.config.js
import baseConfig from '@noaignite/style-guide/prettier/base'

export default {
  ...baseConfig,
  // Your custom rules
}
```

Available configurations:

- `@noaignite/style-guide/prettier/base` - Base configuration for Prettier projects
- `@noaignite/style-guide/prettier/tailwind` - Configuration for TailwindCss projects

### TypeScript Configuration

The package provides several TypeScript configurations that you can extend in your project:

```json
// tsconfig.json
{
  "extends": "@noaignite/style-guide/typescript/base"
}
```

Available configurations:

- `@noaignite/style-guide/typescript/base` - Base configuration for TypeScript projects
- `@noaignite/style-guide/typescript/react` - Configuration for React projects
- `@noaignite/style-guide/typescript/next` - Configuration for Next.js projects

Each configuration includes sensible defaults for different project types. The base configuration includes settings like strict type checking, module resolution settings, and other common TypeScript options.

## Documentation

Visit [https://noaignite.dev](https://noaignite.dev) to view the full documentation.
