---
name: noaignite-types
description: Shared TypeScript helper types for reusable type-level logic
user-invocable: false
---

# @noaignite/types

## Purpose

Shared TypeScript helper types.

## Reference docs

- Installed package: `node_modules/@noaignite/types/dist/docs/`
- Repo-local fallback: `packages/types/dist/docs/`

## Install

```bash
npm i @noaignite/types
```

## Use when

- You need reusable type-level helpers
- You want consistent object, string, union, or mapping types

## Rules

- Prefer these helpers over custom aliases when the same pattern repeats.
- Use this package for types only; no runtime logic.
