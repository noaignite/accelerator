# AGENTS.md

Repository-wide operating instructions for AI agents and coding assistants.

## Commands

Use existing repo commands first. Prefer `pnpm` for all workspace workflows.

- Install deps: `pnpm install --frozen-lockfile`
- Build all packages and apps: `pnpm build`
- Run standard local test suite: `pnpm test`
- Run CI-oriented validation: `pnpm ci:test`
- Run lint only: `pnpm lint`
- Build docs app: `pnpm docs:build`
- Start docs app locally: `pnpm docs:dev`
- Check changeset status against main: `pnpm ci:status`
- Create a changeset: `pnpm changeset`
- Create an empty changeset: `pnpm changeset --empty`

## Stack

- Runtime: Node from `.nvmrc`
- Package manager: `pnpm`
- Monorepo: `Turborepo`
- Language: `TypeScript`
- Testing: `Vitest`
- Docs app: `Next.js` in `docs/`
- Release flow: `Changesets` + GitHub Actions

## Repository Structure

- `packages/*` - published packages and templates
- `docs/` - documentation site and generated content
- `scripts/` - shared repo tooling such as `scripts/generateDocs.ts`
- `.github/workflows/` - CI and release automation
- `.changeset/` - package versioning and release metadata

## Package Rules

- Treat each folder in `packages/*` as its own package boundary.
- Prefer package-local changes over cross-repo refactors unless the task clearly requires multi-package updates.
- Assume changes in shared config, scripts, or workflows may affect several packages.
- Treat `packages/react-*`, `packages/utils`, `packages/types`, `packages/centra-*`, `packages/style-guide`, and `packages/create-app` as important maintained packages; default to checking tests, docs, and release impact.

## Changeset Rules

- Changes to publishable packages usually require a changeset.
- If a change affects package behavior, public API, package config, generated package output, or user-facing docs for a published package, assume a changeset is needed unless there is strong evidence the change is internal only.
- Changeset descriptions should be written from the package's perspective and stay self-contained; do not mention other packages or the monorepo layout in the prose.
- A single changeset may cover multiple packages, but the description itself should still read like a change note for the affected package(s) only.
- Bump guidance:
  - `patch` - bug fixes, small non-breaking improvements, maintenance
  - `minor` - new backward-compatible features
  - `major` - breaking API or behavior changes
- Changes limited to CI, repo metadata, or clearly internal-only tooling usually do not need a changeset.

## Docs Rules

- If public APIs, exports, package behavior, CLI behavior, or setup flows change, check whether docs should also change.
- Relevant docs may live in:
  - `README.md`
  - `packages/*/README.md`
  - `docs/src/content/**`
- The docs site includes generated content. If source-level documentation changes affect generated docs, consider `scripts/generateDocs.ts` and `pnpm docs:build` part of validation.
- If changing `packages/create-app`, check setup and onboarding docs as well.

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

## Examples

### Good PR Summary

```text
Changed packages: `packages/utils`, `docs/`
Changeset: likely required (`patch`) because `packages/utils` behavior changed
Docs: update `packages/utils/README.md` and verify generated docs if exported helpers changed
Verify: `pnpm --filter @noaignite/utils test:unit`, `pnpm test:types`, `pnpm docs:build`
Risk: medium - publishable package change with docs impact
```

### Good Changeset Recommendation

```text
Use a `patch` changeset for `@noaignite/react-utils`.
Reason: this PR fixes existing behavior without introducing a new public API or a breaking change.
```

### Good Docs Follow-Up

```text
Public CLI behavior changed in `packages/create-app`, so check both `packages/create-app/README.md` and `docs/src/content/create-app/**`.
```

## Final Check Before Finishing

- Are all affected packages identified?
- Does the change require a changeset?
- Should any README or docs page be updated?
- Are build, lint, type checks, tests, or docs build needed for confidence?
- Did the change touch shared config, scaffolding, CI, or release flow?
