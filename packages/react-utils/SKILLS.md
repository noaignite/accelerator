---
name: noaignite-react-utils
description: Shared React hooks and component helpers for visibility, refs, and behavior
---

# @noaignite/react-utils

## Purpose

Shared React hooks and component helpers.

## Install

```bash
npm i @noaignite/react-utils
```

## Public API

See `src/index.ts` in source or `dist/index.js` in the published package for the full surface.

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
