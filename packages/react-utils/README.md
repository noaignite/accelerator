# @noaignite/react-utils

React-specific utilities. These helpers are meant for reusable React patterns, component logic, and hooks that are safe to share across apps.

## Installation

`@noaignite/react-utils` is available as an [npm package](https://www.npmjs.com/package/@noaignite/react-utils).

```sh
// with pnpm
pnpm add @noaignite/react-utils

// with yarn
yarn add @noaignite/react-utils

// with npm
npm install @noaignite/react-utils
```

## Imports

Import utilities from the package root or from explicit module subpaths:

```ts
import { useControlled } from '@noaignite/react-utils'
```

Equivalent module imports:

```ts
import { useControlled } from '@noaignite/react-utils/useControlled'
import { ErrorBoundary } from '@noaignite/react-utils/ErrorBoundary'
```

Every module exported at the root has a subpath matching its source-module spelling and case.
Root imports remain supported, and module imports expose the same exports and TypeScript types.
Use the public subpaths without a file extension or `/dist`.

## Component hooks

`UseEffect`, `UseId`, `UseRef`, `UseState`, and `UseRTL` expose hooks as components.
For example, `UseState` passes the state and setter to its render-function child:

```tsx
import { UseState } from '@noaignite/react-utils/useState.component'

;<UseState initialState={0}>
  {([count, setCount]) => <button onClick={() => setCount(count + 1)}>{count}</button>}
</UseState>
```

Each component renders a single React element (or a falsy child). Put a forwarded
`ref` on the component hook, not its child; fragments cannot receive that ref.
`UseRTL` can track the rendered element's direction with `scoped` and adds
`data-ltr` or `data-rtl` to its child.

<!-- package-docs:exports -->

## Documentation

Visit [https://noaignite.dev/react-utils](https://noaignite.dev/react-utils) to view the full documentation.

## AI Agent Skills

If you use an AI agent, run `npx @tanstack/intent@latest install` to install package skills for `@noaignite/react-utils`.

## Contributing

Read the [contributing guide](https://github.com/noaignite/accelerator/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Changelog

The [changelog](https://github.com/noaignite/accelerator/releases) is regularly updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the [MIT license](https://github.com/noaignite/accelerator/blob/main/LICENSE).
