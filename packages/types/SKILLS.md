---
name: noaignite-types
description: Shared TypeScript helper types for reusable type-level logic
---

# @noaignite/types

## Purpose

Shared TypeScript helper types.

## Install

```bash
npm i @noaignite/types
```

## Public API

See `src/index.ts` for the full surface.

## Use when

- You need reusable type-level helpers
- You want consistent object, string, union, or mapping types

## Rules

- Prefer these helpers over custom aliases when the same pattern repeats.
- Use this package for types only; no runtime logic.
