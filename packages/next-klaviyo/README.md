# @noaignite/next-klaviyo

React helpers for loading and using Klaviyo in Next.js applications. The package provides a script component for bootstrapping the [Klaviyo JavaScript API](https://developers.klaviyo.com/en/docs/javascript_api) and typed helpers for `identify` and `track` calls.

## Installation

`@noaignite/next-klaviyo` is available as an [npm package](https://www.npmjs.com/package/@noaignite/next-klaviyo).

```sh
// with pnpm
pnpm add @noaignite/next-klaviyo

// with yarn
yarn add @noaignite/next-klaviyo

// with npm
npm install @noaignite/next-klaviyo
```

<!-- package-docs:exports -->

## Getting started

Render `KlaviyoScript` near the root of your Next.js App Router application and provide your Klaviyo public API key:

```tsx
import type { ReactNode } from 'react'
import { KlaviyoScript } from '@noaignite/next-klaviyo'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KlaviyoScript publicApiKey={process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY!} />
        {children}
      </body>
    </html>
  )
}
```

Once the script is mounted, you can use the `klaviyo` helper anywhere in client-side code:

```tsx
import { klaviyo } from '@noaignite/next-klaviyo'

klaviyo.identify({
  email: 'jane@example.com',
  first_name: 'Jane',
})

klaviyo.track('Started Checkout', {
  $event_id: 'checkout-123',
  $value: 199,
  ItemNames: ['Cropped Jacket'],
  CheckoutURL: 'https://example.com/checkout',
  Categories: ['Outerwear'],
  Items: [],
})
```

## Documentation

Visit [https://noaignite.dev/next-klaviyo](https://noaignite.dev/next-klaviyo) to view the full documentation.

## Contributing

Read the [contributing guide](https://github.com/noaignite/accelerator/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Changelog

The [changelog](https://github.com/noaignite/accelerator/releases) is regularly updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the [MIT license](https://github.com/noaignite/accelerator/blob/main/LICENSE).
