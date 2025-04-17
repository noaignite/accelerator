# NoA Ignite Accelerator

NoA Ignite Accelerator is a Turborepo‑powered monorepo that bundles a suite of first‑class TypeScript packages and tools designed to jump‑start and standardize frontend projects at NoA Ignite.

## Documentation

For details on how to use the accelerator, check out our [documentation](https://noaignite.dev/).

## Starting a new project?

Starting a new project is done through a combination of the `create-turbo` and the `@noaignite/create-app` executables.

### Installing Turborepo

Create a new project with [Turborepo](https://turbo.build/) from [Vercel](https://vercel.com/).

```bash
// with pnpm (recommended)
pnpm dlx create-turbo@latest -m pnpm

// with yarn
yarn dlx create-turbo@latest -m yarn

// with npm
npx create-turbo@latest -m npm
```

### Installing NoA Ignite templates

Now that the initial scaffolding of the project is out of the way we can start installing templates that we might need.

1. First change the directory to the newly created turborepo. For example:

```bash
cd my-turborepo
```

2. Run the NoA Ignite executable with the same package manager you used in the previous step.

```bash
// with pnpm (recommended)
pnpm dlx @noaignite/create-app

// with yarn
yarn dlx @noaignite/create-app

// with npm
npx @noaignite/create-app
```

## What's inside this monorepo?

This Turborepo includes the following packages/apps:

### Apps and Packages

- [`docs`](https://github.com/noaignite/accelerator/tree/main/docs): Accelerator docs
- [`@noaignite/centra-mocks`](https://noaignite.dev/@noaignite/centra-mocks/README): A collection of mocks to the Centra API
- [`@noaignite/centra-types`](https://noaignite.dev/@noaignite/centra-types/README): Typescript definitions for Centra APIs
- [`@noaignite/create-app`](https://noaignite.dev/@noaignite/create-app/README): A CLI tool to scaffold out templates within a Turborepo project
- [`@noaignite/react-centra-checkout`](https://noaignite.dev/@noaignite/react-centra-checkout/README): React helper functions for Centra APIs
- [`@noaignite/react-utils`](https://noaignite.dev/@noaignite/react-utils/README): React helper functions
- [`@noaignite/style-guide`](https://noaignite.dev/@noaignite/style-guide/README): A collection of configurations for `eslint`, `prettier` & `typescript`
- [`@noaignite/tailwind-typography`](https://noaignite.dev/@noaignite/tailwind-typography/README): TailwindCSS plugin to create responsive typography
- [`@noaignite/types`](https://noaignite.dev/@noaignite/types/README): Type helpers by NoA Ignite
- [`@noaignite/utils`](https://noaignite.dev/@noaignite/utils/README): Basic helper functions

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

```sh
pnpm dev
```
