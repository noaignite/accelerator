---
'@noaignite/react-centra-checkout': major
---

resolve TypeScript / ESlinting issues + update `resetSelection` type signature.

# Breaking change

## WHAT

`resetSelection` now returns a `Promise<void>` instead of `void`, which allows for better handling of potential race conditions.

## WHY

To evade potential race conditions between different state changes to `selection`.

## HOW

A user may need to add `await` to their calls to the `resetSelection` function.
