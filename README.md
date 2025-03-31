# NoA Ignite Accelerator

A collection of NoA Ignite packages.

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

- [`docs`](./docs): Accelerator docs
- [`@noaignite/centra-mocks`](./packages/centra-mocks): A collection of mocks to the Centra API
- [`@noaignite/centra-types`](./packages/centra-types): Typescript definitions for Centra APIs
- [`@noaignite/create-app`](./packages/create-app): A CLI tool to scaffold out templates within a Turborepo project
- [`@noaignite/react-centra-checkout`](./packages/react-centra-checkout): React helper functions for Centra APIs
- [`@noaignite/react-utils`](./packages/react-utils): React helper functions
- [`@noaignite/tailwind-typography`](./packages/tailwind-typography): TailwindCSS plugin to create responsive typography
- [`@noaignite/types`](./packages/types): Type helpers by NoA Ignite
- [`@noaignite/utils`](./packages/utils): Basic helper functions
- [`@repo/eslint-config`](./packages/eslint-config): `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- [`@repo/prettier-config`](./packages/prettier-config): `prettier` configurations (includes `@vercel/style-guide`)
- [`@repo/typescript-config`](./packages/typescript-config): `tsconfig.json`s used throughout the monorepo

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

## Contributing

Want to help out and contribute? Please see our [contributing doc](./CONTRIBUTING.md).
