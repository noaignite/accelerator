# @noaignite/centra-types

This package contains Typescript definitions, intepreted from the Klarna Checkout clientside events.

## Installation

klarna-checkout-types is available as an [npm package](https://www.npmjs.com/package/@noaignite/klarna-checkout-types).

```sh
// with npm
npm install @noaigniteklarna-checkout-types/

// with yarn
yarn add @noaignite/klarna-checkout-types
```

## Usage

```typescript
import type { Klarna } from '@noaignite/klarna-checkout-types'

declare global {
  interface Window {
    _klarnaCheckout?: (callback: Klarna.CheckoutCallback) => void
  }
}
```

