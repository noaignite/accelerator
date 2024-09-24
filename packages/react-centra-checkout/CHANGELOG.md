# @noaignite/react-centra-checkout

## 2.0.0

### Major Changes

- 1ab6612: bump minimum engine node version from 14 to 20
- 91ba9cc: resolve TypeScript / ESlinting issues + update `resetSelection` type signature.

  # Breaking change

  ## WHAT

  `resetSelection` now returns a `Promise<void>` instead of `void`, which allows for better handling of potential race conditions.

  ## WHY

  To evade potential race conditions between different state changes to `selection`.

  ## HOW

  A user may need to add `await` to their calls to the `resetSelection` function.

- 8fb0f01: convert all default exports to named exports

### Patch Changes

- Updated dependencies [5f9af13]
  - @noaignite/utils@3.1.0

## 1.2.1

### Patch Changes

- 94df321: Removes invalid call to CentraCheckout.suspend, fixes PaymentEmbed not rendering

## 1.2.0

### Minor Changes

- 35f383c: Migrate @noaignite/react-centra-checkout to new turborepo setup
