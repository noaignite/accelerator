---
name: noaignite-centra-mocks
description: Mock Centra API responses for tests and local development
user-invocable: false
---

# @noaignite/centra-mocks

## Purpose

Mock Centra API responses for tests and local development.

## Reference docs

- Installed package: `node_modules/@noaignite/centra-mocks/dist/docs/`
- Repo-local fallback: `packages/centra-mocks/dist/docs/`

## Install

```bash
npm i -D @noaignite/centra-mocks
```

## Use when

- You need realistic Centra fixtures in tests
- You want repeatable mock payloads for integration code

## Rules

- Use this package for test support only.
- Prefer the shared fixtures over custom ad hoc mock objects.
