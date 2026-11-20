# AGENTS.md

Repository-wide operating instructions for AI agents and coding assistants.

## Repository Structure

- `apps/docs/` - documentation site and generated content
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

A changeset is a markdown file in `.changeset/` with YAML frontmatter listing affected packages and their bump type (patch/minor/major).

### Changeset Rules

1. Every PR must include a changeset.
2. If your change modifies a package in `/packages/*`, include it in the changeset frontmatter, except when that package has only test-file changes. Tests include `*.test.*`, `*.spec.*`, Python `test_*.py` / `*_test.py`, and files under `test/`, `__tests__/`, or `__snapshots__/` directories; runtime/API, dependency, and packaging changes still require package coverage.
3. If your change only affects non-package files (docs, config, examples, internal tooling) or test files, create a changeset with **empty frontmatter** - just the description. Mixed PRs need package release entries only for packages with non-test changes.
4. Keep changeset descriptions scoped to the packages listed in their frontmatter. If affected packages need different release notes, create separate changeset files.
5. Private workspaces and ignored packages are not release entries. Report conflicts between `/packages/*` coverage requirements and live Changesets configuration rather than inventing release metadata.
6. Use `patch`, `minor`, or `major` according to consumer impact, and quote package names in frontmatter.
7. Write one concise, release-note-oriented paragraph beginning with `<Area>: <Change>` (for example `useElementSize:` or `Deps:` followed by a capitalized action). Put extended explanations in relevant documentation rather than implementation-detail dumps or nested bullets.

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-a-changeset-to-your-pull-request) for commands and examples.

## Docs Rules

- If public APIs, exports, package behavior, CLI behavior, or setup flows change, check whether docs should also change.
- Relevant docs may live in:
  - `README.md`
  - `packages/*/README.md`
  - `apps/docs/src/content/**`
- The docs site includes generated content. If source-level documentation changes affect generated docs, consider `scripts/assembleDocsContent.ts` and `pnpm build` part of validation.

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

## Pull Request Conventions

- Prefer conventional-commit-style titles: `type(scope): short summary`, for example `fix(react-utils): correct element size calculation`. Describe the change directly, without agent-specific prefixes.
- PR bodies should be prose-first and explain what changed, why, user or runtime impact, actual validation, and failed or skipped checks with causes.
- Docs-only bodies explicitly say so and remain brief. Preserve useful issue links and reviewer context; no particular headings or checklists are required.
- Validation and drafting are read-only. Update GitHub metadata only when the user authorizes an update.

## Agent skills

### Changesets and PR metadata

Before creating, correcting, or checking branch changesets, use
`.agents/skills/changeset-pr/SKILL.md`.
Before validating, drafting, or updating GitHub PR titles or bodies, use
`.agents/skills/gh-pr-metadata/SKILL.md`.

### Issue tracker

Track work in GitHub Issues and Accelerator Project #8. Before reading,
creating, or updating tickets, read `docs/agents/issue-tracker.md`.

### Triage labels

Use the five canonical triage labels. Before triaging issues, read
`docs/agents/triage-labels.md`.

### Domain docs

Use a single-context glossary and ADR layout. Before exploring domain
concepts or proposing architectural changes, read `docs/agents/domain.md`.
