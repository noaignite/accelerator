# @noaignite/react-centra-checkout

[NoA Ignite](https://noaignite.se/) Centra helpers. Previously known as [@oakwood/accelerator](https://github.com/oakwood/accelerator).

## Installation

react-centra-checkout is available as an [npm package](https://www.npmjs.com/package/@noaignite/react-centra-checkout).

```sh
// with npm
npm install @noaignite/react-centra-checkout

// with yarn
yarn add @noaignite/react-centra-checkout
```

## Why
This package exists to ease development of react frontend applications using the [Centra Checkout API](https://docs.centra.com/api-references/checkout-api/introduction).

Most importantly, it exposes a `CentraProvider` that you wrap your application with (for Next.js projects, usually in _app.js), and a set of hooks to fetch api endpoints and update the user selection.

It does not attempt to abstract the Centra api, but rather exposes the endpoints in a React way of calling them.

## Documentation
https://react-centra-checkout-docs.vercel.app

