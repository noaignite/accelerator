# AGENTS.md

Repository-wide operating instructions for AI agents and coding assistants.

## Repository Structure

- `docs/` - documentation site and generated content
- `packages/*` - published packages and templates
- `scripts/` - shared repo tooling

## Essential Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build all workspaces
pnpm packages:build   # Build all packages
pnpm lint             # ESLint check
pnpm test:types       # TypeScript validation
pnpm test:unit        # Run unit tests
pnpm changeset        # Create a changeset
```

### Scope-Aware Validation

When editing one package/app, prefer targeted `-F` runs before repo-wide commands:

```bash
pnpm -F <workspace> lint
pnpm -F <workspace> test:types
pnpm -F <workspace> test:unit
pnpm -F <workspace> build
```

## Changesets

**Always create a changeset for all PRs.**

```bash
pnpm changeset
```

A changeset is a markdown file in `.changeset/` with YAML frontmatter listing affected packages and their bump type (patch/minor/major).

### Changeset Rules

1. Every PR must include a changeset (use empty frontmatter for non-package changes).
2. If your change modifies a package in `/packages/*`, include it in the changeset frontmatter
3. If your change only affects non-package files (docs, config, examples, internal tooling), create a changeset with **empty frontmatter** - just the description
4. Keep changeset descriptions scoped to the packages listed in their frontmatter. If affected packages need different release notes, create separate changeset files.

Example changeset for a package change:

```md
---
'@noaignite/react-utils': minor
---

useElementSize: Fix faulty size computation.
```

Example changeset for non-package changes:

```md
---
---

CI: Update workflow configuration.
```

## Docs Rules

- If public APIs, exports, package behavior, CLI behavior, or setup flows change, check whether docs should also change.
- Relevant docs may live in:
  - `README.md`
  - `packages/*/README.md`
  - `docs/src/content/**`
- The docs site includes generated content. If source-level documentation changes affect generated docs, consider `scripts/generateDocs.ts` and `pnpm docs:build` part of validation.

## Git Workflow

- Keep changes scoped and minimal.
- Preserve existing user changes in the worktree; do not revert unrelated modifications.
- Do not make destructive git changes such as hard resets, force checkouts, or history rewrites unless explicitly requested.
- Do not create commits, branches, tags, or pushes unless the user asks for them.

## Boundaries

### Always

- Use `pnpm` commands that already exist in the repo.
- Identify affected packages or apps when analyzing changes.
- Check whether a changeset is needed for publishable package changes.
- Check whether README or docs updates are needed for public-facing changes.
- Recommend the smallest existing verification commands that give confidence.
- Follow existing code style and package boundaries.

### Ask First

- Adding or removing dependencies
- Breaking public API changes
- Editing CI, release, or publishing workflows
- Changing package ownership boundaries or large cross-repo structure
- Making destructive git operations

### Never

- Use `npm` or `yarn` for repo-wide workflows
- Ignore likely docs impact for public API or CLI changes
- Add, remove, or bypass changesets casually
- Introduce release workflow changes without considering publish and Slack notification impact
- Edit secrets, credentials, or generated vendor content as part of routine work

## PR Review Output

When reviewing or summarizing a PR, prefer this shape:

- Changed packages/apps
- Changeset needed or not needed, with reasoning
- Docs impact
- Recommended verification commands
- Risk level: low, medium, or high

Avoid spending most of the review on generic style comments that linting or formatting already covers.
