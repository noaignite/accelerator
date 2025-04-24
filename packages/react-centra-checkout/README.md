# @noaignite/react-centra-checkout

[NoA Ignite](https://noaignite.se/) Centra helpers. Previously known as [@oakwood/accelerator](https://github.com/oakwood/accelerator).

## Installation

react-centra-checkout is available as an [npm package](https://www.npmjs.com/package/@noaignite/react-centra-checkout).

```sh
// with pnpm
pnpm add @noaignite/react-centra-checkout

// with yarn
yarn add @noaignite/react-centra-checkout

// with npm
npm install @noaignite/react-centra-checkout
```

## Why

This package exists to ease development of react frontend applications using the [Centra Checkout API](https://docs.centra.com/api-references/checkout-api/introduction).

Most importantly, it exposes a `CentraProvider` that you wrap your application with (for Next.js projects, usually in \_app.js), and a set of hooks to fetch api endpoints and update the user selection.

It does not attempt to abstract the Centra api, but rather exposes the endpoints in a React way of calling them.

## Getting started

Start by wrapping your applications root component with `CentraProvider` and supply it with `apiUrl` (the api url to your Centra checkout api), `paymentReturnPage` (url to the api route in your app which handles successful payments) and `paymentFailedPage` (url to the api route for failed payments) like so:

```tsx
import { CentraProvider } from '@noaignite/react-centra-checkout'

const App = () => (
  <CentraProvider
    apiUrl={process.env.CHECKOUT_API}
    paymentReturnPage={({ token }) => `${process.env.APP_URL}/api/centra/checkout-success/${token}`})}
    paymentFailedPage={({ token }) => `${process.env.APP_URL}/api/centra/checkout-failed/${token}`)}
  >
    <AppProvider>
      <AppBase>
        <Component {...pageProps} />
      </AppBase>
    </AppProvider>
  </CentraProvider>
)
```

By default, the CentraProvider will handle fetching the initial selection for the user, so by wrapping your apps root component, you get access to the `useCentraSelection` and `useCentraHandlers` hooks.

### Getting things from the selection

To get data from the current selection, simply destruct whatever you want from the `useCentraSelection` hook, like so:

```tsx
import { useCentraSelection } from '@noaignite/react-centra-checkout'

const Component = () => {
  const { selection, paymentMethods } = useCentraSelection()
  const { items, currency, totals } = selection

  // ...
}
```

### Updating the selection

To update the selection, call one of the update handlers from the `useCentraHandlers` hook:

```tsx
import { useCentraHandlers } from '@noaignite/react-centra-checkout'

const Component = () => {
  const { addItem } = useCentraHandlers()

  const handleClick = () => {
    addItem(size, 1)
  }
}
```

### Calling endpoints server-side

The Centra selection and handlers will only be available client-side. To make api calls against Centra server-side (e.g when fetching products), you need to call the api directly using the Api client:

```tsx
import { ApiClient } from '@noaignite/react-centra-checkout'

const fetchProductsFromCategory = async () => {
  const response = await ApiClient.default.request('POST', 'products', { categories: ['15'] })
}
```

## Documentation

Visit [https://noaignite.dev](https://noaignite.dev) to view the full documentation.
