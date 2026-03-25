---
name: noaignite-style-guide
description: Shared ESLint, Prettier, and TypeScript config presets
user-invocable: false
---

# @noaignite/style-guide

## Purpose

Shared ESLint, Prettier, and TypeScript config package.

## Reference docs

- Installed package: `node_modules/@noaignite/style-guide/dist/docs/`
- Repo-local fallback: `packages/style-guide/dist/docs/`

## Install

```bash
npm i -D @noaignite/style-guide
```

## Use when

- You are bootstrapping a new app or package
- You want NoA Ignite linting, formatting, or TS baselines

## Rules

- Prefer these presets over custom local config.
- Use the Next.js config for Next apps and the React config for generic React apps.
