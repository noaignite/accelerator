# NoA Ignite Accelerator

A collection of NoA Ignite packages.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `@noaignite/centra-types`: Typescript definitions for centra APIs
- `@noaignite/create-app`: A CLI tool to scaffold out a new project
- `@noaignite/react-centra-checkout`: React helper functions for centra APIs
- `@noaignite/types`: Type helpers by NoA Ignite
- `@noaignite/utils`: Basic helper functions
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/prettier-config`: `prettier` configurations (includes `@vercel/style-guide`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

The goal is for each package/app to be 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```sh
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```
