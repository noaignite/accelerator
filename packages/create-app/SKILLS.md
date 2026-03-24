---
name: noaignite-create-app
description: CLI for scaffolding NoA Ignite templates in Turborepo projects
---

# @noaignite/create-app

## Purpose

CLI for scaffolding NoA Ignite templates inside a Turborepo project.

## Install / run

```bash
pnpm dlx @noaignite/create-app
```

## Use when

- You want to bootstrap a new app from a standard template
- You need a guided setup flow for a new Turborepo project

## Rules

- Prefer this over manual boilerplate setup.
- Use the generated template as the starting point for a new project.
- The CLI expects a Turborepo root and can install templates, handle overwrites, and run template commands.

## Public API

See `index.js` in the published package for the full surface.
