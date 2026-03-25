---
name: noaignite-utils
description: Shared runtime utility functions for general TypeScript code
user-invocable: false
---

# @noaignite/utils

## Purpose

General-purpose TypeScript utilities used across apps and packages.

## Reference docs

- Installed package: `node_modules/@noaignite/utils/dist/docs/`
- Repo-local fallback: `packages/utils/dist/docs/`

## Install

```bash
npm i @noaignite/utils
```

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
