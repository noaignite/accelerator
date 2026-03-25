# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, etc.) when working with the skills in this repository.

## Repository Overview

A collection of NoA Ignite agent skills. Skills are packaged instructions that point to published package docs for deeper reference.

## Creating a New Skill

### Directory Structure

```
skills/
  {skill-name}/           # kebab-case directory name
    SKILL.md              # Required: skill definition
```

### Naming Conventions

- **Skill directory**: `kebab-case` (e.g., `noaignite-deploy`, `log-monitor`)
- **SKILL.md**: Always uppercase, always this exact filename

### SKILL.md Format

````markdown
---
name: noaignite-<pkg>
description: <short package summary>
user-invocable: <true|false>
---

# @noaignite/<pkg>

## Purpose

<1-2 lines describing the package>

## Reference docs

- Installed package: `node_modules/@noaignite/<pkg>/dist/docs/`
- Repo-local fallback: `packages/<pkg>/dist/docs/`

## Install

```bash
npm i @noaignite/<pkg>
```
````

## Use when

- <when to use the package>
- <another use case>

## Rules

- <package-specific rule>
- <package-specific rule>

## Example

```ts
import { ... } from '@noaignite/<pkg>'
```

```

### Best Practices for Context Efficiency

Skills are loaded on-demand — only the skill name and description are loaded at startup. The full `SKILL.md` loads into context only when the agent decides the skill is relevant. To minimize context usage:

- **Keep SKILL.md under 500 lines** — put detailed reference material in separate files
- **Write specific descriptions** — helps the agent know exactly when to activate the skill
- **Use progressive disclosure** — reference supporting files that get read only when needed
- **File references work one level deep** — link directly from SKILL.md to supporting files
```
