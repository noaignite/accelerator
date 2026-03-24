---
name: noaignite-centra-mocks
description: Mock Centra API responses for tests and local development
---

# @noaignite/centra-mocks

## Purpose

Mock Centra API responses for tests and local development.

## Install

```bash
npm i -D @noaignite/centra-mocks
```

## Public API

See `src/index.ts` in source or `dist/index.js` in the published package for the full surface.

## Use when

- You need realistic Centra fixtures in tests
- You want repeatable mock payloads for integration code

## Rules

- Use this package for test support only.
- Prefer the shared fixtures over custom ad hoc mock objects.
