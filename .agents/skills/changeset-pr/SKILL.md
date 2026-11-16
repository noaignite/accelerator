---
name: changeset-pr
description: Create or update `.changeset/*.md` files for the current branch or PR, choose package scope and release type, and verify coverage against Accelerator's live Changesets config. Use for missing or incorrect changesets and branch coverage checks, including non-package and test-only PRs.
---

# Changeset PR

Before choosing package scope, release type, or summary wording, read the
[Changeset Rules](../../../AGENTS.md#changeset-rules).
Use [CONTRIBUTING.md](../../../CONTRIBUTING.md#adding-a-changeset-to-your-pull-request)
for file examples and interactive commands.

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

Apply the Changeset Rules to this output. Resolve private/ignored configuration
conflicts and moved/removed identities before selecting release entries.

## Create Or Update The Changeset

Search branch-local `.changeset/*.md` files for the selected packages or change
description. Edit an existing note if it covers the same work; otherwise create
a new file using the linked contributor examples. Preserve unrelated notes
inherited from the base.

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

Read [helper interpretation and prerequisites](./references/repo-conventions.md)
when interpreting scope warnings or release-plan output. After any note edit,
rerun both coverage and release-plan checks; report unresolved failures.

## Report Back

Always report:

- whether package releases or an empty changeset were needed
- which packages were included and which files were created or updated
- the comparison base and whether local work was included
- which commands were run
- whether `changeset status` succeeded
- any fixed-group, private/ignored-package, or move/removal caveats

This procedure ends with validated notes and the report; it does not execute a release.
