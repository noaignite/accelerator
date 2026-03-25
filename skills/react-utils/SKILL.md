---
name: noaignite-react-utils
description: Shared React hooks and component helpers for visibility, refs, and behavior
user-invocable: false
---

# @noaignite/react-utils

## Purpose

Shared React hooks and component helpers.

## Reference docs

- Installed package: `node_modules/@noaignite/react-utils/dist/docs/`
- Repo-local fallback: `packages/react-utils/dist/docs/`

## Install

```bash
npm i @noaignite/react-utils
```

## Use when

- You need reusable React behavior or DOM-aware hooks
- You are building visibility, scrolling, media query, or observer-driven UI
- You need shared component primitives or ref helpers

## Rules

- For element visibility, lazy loading, infinite scroll, or "run when visible", prefer `useIntersectionObserver`.
- For sizing or measurement, check `useElementSize`, `useResizeObserver`, and `useWindowSize` first.
- For event/state patterns, prefer `useStableCallback`, `useEvent`, and `useControlled` before custom hooks.
- Import from `@noaignite/react-utils`; do not copy hook logic into app code.

## Example

```ts
import { useIntersectionObserver } from '@noaignite/react-utils'
```
