---
name: changeset-pr
description: Create or update `.changeset/*.md` files for the current branch or PR, choose package scope and release type, and verify coverage against Accelerator's live Changesets config. Use for missing or incorrect changesets and branch coverage checks, including non-package and test-only PRs.
---

# Changeset PR

## Overview

Create a repo-correct changeset for the current branch, or update an existing one without widening scope unnecessarily. Verify both syntax and package scope before handoff.

Ground the changeset in the live branch diff, not stale branch intent. Always inspect the current branch state against its base before choosing package scope or release type.

## Workflow

1. Confirm whether a package release or an empty changeset is needed.
2. Identify the publishable package scope from the live branch diff.
3. Create or edit `.changeset/*.md` files.
4. Validate the files against repo config and branch scope.
5. Report the exact commands run and any ambiguity that remains.

## Decide Whether A Package Release Is Needed

- Every PR needs a changeset, including docs, apps, internal tooling, and test-only changes.
- Include affected `/packages/*` packages in the frontmatter, except packages with only test-file changes. Use empty frontmatter for non-package or test-only changes; follow root `AGENTS.md` for test-file conventions.
- Read the root `AGENTS.md` Changeset Rules before choosing scope or release types.

Read [references/repo-conventions.md](./references/repo-conventions.md) for config, validation, and release boundaries.

## Determine Scope

First inspect the live branch state:

```bash
git status --short
git diff --name-status origin/main...HEAD
git diff --stat origin/main...HEAD
git log --oneline --decorate --no-merges origin/main..HEAD
```

Use the PR's actual base branch, or an explicit user-supplied ref, instead of `origin/main` when applicable. Verify the comparison ref exists before continuing.

Use that to separate publishable-package changes from repo-local docs, skills, tooling, or cleanup. Keep committed PR changes separate from unpublished local work.

Start with the helper script:

```bash
python3 .agents/skills/changeset-pr/scripts/inspect_changeset_scope.py --base origin/main
```

Add `--include-working-tree` when preparing changesets for local work. The default compares committed files and notes; working-tree mode uses the net diff against the base, plus untracked files. Add `--json` for structured output.

Use its output to separate:

- touched publishable packages
- private and ignored packages
- moved or removed package identities that need a release decision
- fixed groups that will affect release planning

If the branch changes non-test files in multiple publishable packages, include those packages. Exclude packages with only test changes. Do not add private or ignored apps/internal packages. Report conflicts between `/packages/*` changes and private/ignored configuration rather than inventing release metadata.

## Create Or Update The Changeset

Prefer editing an existing branch changeset when one already covers the same change. Otherwise create a new file in `.changeset/` with the standard format:

Example changeset for a package change:

```md
---
'@noaignite/react-utils': minor
---

useElementSize: Add support for observing element size.
```

Example changeset for a package dependency update:

```md
---
'@noaignite/style-guide': patch
---

Deps: Update `prettier-plugin-tailwindcss` from 0.7.2 to 0.8.0.
```

Example changeset for non-package changes:

```md
---
---

CI: Update workflow configuration.
```

Rules:

- Write the description as one concise, release-note-oriented paragraph. Put extended explanations and examples in the relevant documentation.
- Start each summary with `<Area>: <Change>`. Use the affected public API name (for example `useElementSize:`), or a concise category for broader changes (`Deps:`, `Docs:`, `ESLint:`, `CI:`). Follow the colon with a capitalized action describing the change.
- Avoid implementation-detail dumps and nested bullets.
- Use `patch`, `minor`, or `major` according to the actual consumer impact.
- Quote package names in frontmatter.
- Keep package scope tight even if release planning later broadens the computed plan.
- Use separate changesets when affected packages need different release notes.
- For non-package-only work, leave the frontmatter empty and include a short description.
- For test-only work, use empty frontmatter; mixed PRs need entries only for packages with non-test changes.

Create files directly, or use `pnpm changeset` interactively.

## Validate

There is no dedicated `changeset validate` command in the official CLI. Use these checks instead:

1. Validate aggregate branch coverage:

   ```bash
   python3 .agents/skills/changeset-pr/scripts/inspect_changeset_scope.py --base origin/main
   ```

   Use the same working-tree mode as the scope inspection. Repeat `--file .changeset/<file>.md` to validate specific local notes instead of auto-discovered branch notes.

2. Validate that Changesets can parse and plan the release:

   ```bash
   python3 .agents/skills/changeset-pr/scripts/run_changeset_status.py --verbose
   ```

3. When machine-readable output is useful:

   ```bash
   python3 .agents/skills/changeset-pr/scripts/run_changeset_status.py --json
   ```

Interpretation:

- `status` verifies parseability and computed release planning.
- `status` does not prove the changeset is branch-local or minimal because other pending changesets may already exist.
- Empty changesets can correctly produce no package release; the scope helper checks their presence and description separately.
- Fixed-group packages can cause broader or higher bumps than the frontmatter alone suggests; read live config rather than assuming a group exists.
- The scope helper reports indirect package scope and moved/removed identities for agent judgement; it does not determine semantic versioning from file paths.

## Update Existing Changesets

When asked to update a changeset for a branch or PR:

- search branch-local `.changeset/*.md` files for the affected package name first
- prefer editing the existing file if it clearly belongs to the same branch work
- avoid creating duplicate files for the same single change unless the branch intentionally has multiple release notes
- preserve unrelated pending changesets inherited from the base

After editing, rerun both validation steps.

## Report Back

Always report:

- whether package releases or an empty changeset were needed
- which packages were included and which files were created or updated
- the comparison base and whether local work was included
- which commands were run
- whether `changeset status` succeeded
- any fixed-group, private/ignored-package, or move/removal caveats

This skill prepares release notes only; publishing, pushing, or creating a PR requires separate user authorization.
