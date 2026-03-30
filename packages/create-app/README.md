# @noaignite/create-app

CLI for scaffolding NoA Ignite templates inside a Turborepo project. It guides users through template selection, file overwrite handling, and post-install commands.

## Starting a new project?

Starting a new project uses both the `create-turbo` and `@noaignite/create-app` executables.

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

Once the Turborepo is scaffolded, install the templates you need.

1. Change to the newly created Turborepo directory. For example:

```bash
cd my-turborepo
```

2. Run the NoA Ignite CLI with the same package manager you used in the previous step.

```bash
// with pnpm (recommended)
pnpm dlx @noaignite/create-app

// with yarn
yarn dlx @noaignite/create-app

// with npm
npx @noaignite/create-app
```

## Documentation

Visit [https://noaignite.dev/create-app](https://noaignite.dev/create-app) to view the full documentation.

## Contributing

Read the [contributing guide](https://github.com/noaignite/accelerator/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Changelog

The [changelog](https://github.com/noaignite/accelerator/releases) is regularly updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the [MIT license](https://github.com/noaignite/accelerator/blob/main/LICENSE).
