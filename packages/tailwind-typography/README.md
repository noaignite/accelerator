# @noaignite/tailwind-typography

Tailwind CSS plugin for responsive typography.

## Installation

`@noaignite/tailwind-typography` is available as an [npm package](https://www.npmjs.com/package/@noaignite/tailwind-typography).

```sh
// with pnpm
pnpm add @noaignite/tailwind-typography

// with yarn
yarn add @noaignite/tailwind-typography

// with npm
npm install @noaignite/tailwind-typography
```

## Usage

Use `typography()` to define responsive typography variants and generate utility classes from your design tokens. The example below shows a basic setup with custom breakpoints, a class prefix, and fluid type scaling.

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { typography } from '@noaignite/tailwind-typography'

const config: Config = {
  content: [
    // ...
  ],
  theme: {
    // ...
  },
  plugins: [
    typography({
      breakpointKeys: ['xs', 'md', 'xl'] as const,
      prefix: 'type-' as const,
      unit: 'rem',
      fluid: true,
      variants: {
        h1: {
          xs: {
            fontFamily: 'var(--font-primary)',
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.2,
            textTransform: 'uppercase',
          },
          md: { fontSize: 72 },
        },
        body1: {
          fontFamily: 'var(--font-secondary)',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.2,
        },
      },
    }),
  ],
}

export default config
```

This configuration makes `type-h1`, `type-h1-xs`, `type-h1-md`, and `type-body1` available as utility classes.

<!-- package-docs:exports -->

## Documentation

Visit [https://noaignite.dev/tailwind-typography](https://noaignite.dev/tailwind-typography) to view the full documentation.

## Contributing

Read the [contributing guide](https://github.com/noaignite/accelerator/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Changelog

The [changelog](https://github.com/noaignite/accelerator/releases) is regularly updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the [MIT license](https://github.com/noaignite/accelerator/blob/main/LICENSE).
