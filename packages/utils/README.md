# @noaignite/utils

Framework-agnostic utilities. Use these for small, reusable building blocks that keep common logic consistent across projects.

## Installation

`@noaignite/utils` is available as an [npm package](https://www.npmjs.com/package/@noaignite/utils).

```sh
// with pnpm
pnpm add @noaignite/utils

// with yarn
yarn add @noaignite/utils

// with npm
npm install @noaignite/utils
```

## Imports

Import utilities from the package root or from explicit module subpaths:

```ts
import { clamp } from '@noaignite/utils'
```

Equivalent module imports:

```ts
import { clamp } from '@noaignite/utils/clamp'
import { URLSearchParamsFromObject } from '@noaignite/utils/URLSearchParamsFromObject'
```

Every module exported at the root has a subpath matching its source-module spelling and case.
Root imports remain supported, and module imports expose the same exports and TypeScript types.
Use the public subpaths without a file extension or `/dist`.

<!-- package-docs:exports -->

## Documentation

Visit [https://noaignite.dev/utils](https://noaignite.dev/utils) to view the full documentation.

## Contributing

Read the [contributing guide](https://github.com/noaignite/accelerator/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Changelog

The [changelog](https://github.com/noaignite/accelerator/releases) is regularly updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the [MIT license](https://github.com/noaignite/accelerator/blob/main/LICENSE).
