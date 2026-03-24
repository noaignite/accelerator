---
name: noaignite-utils
description: Shared runtime utility functions for general TypeScript code
---

# @noaignite/utils

## Purpose

General-purpose TypeScript utilities used across apps and packages.

## Install

```bash
npm i @noaignite/utils
```

## Public API

See `src/index.ts` in source or `dist/index.js` in the published package for the full surface.

## Use when

- You need shared runtime helper logic
- You want to avoid duplicated utility code in apps
- You need general data, math, object, color, or URL helpers

## Rules

- Prefer these helpers over local one-off functions.
- Use `debounce`, `clamp`, `deepmerge`, and `normalizeToArray` before writing custom equivalents.
- If a helper already exists here, import it instead of reimplementing it.

## Example

```ts
import { clamp, debounce } from '@noaignite/utils'
```
