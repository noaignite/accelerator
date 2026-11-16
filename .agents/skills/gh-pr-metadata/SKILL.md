---
name: gh-pr-metadata
description: Validate, draft, or update GitHub PR titles and bodies to match Accelerator's prose-first guidance and conventional-commit title style. Use for vague titles, incomplete bodies, or metadata corrections before review or merge. Validation and drafting are read-only; updates require user authorization.
---

# GH PR Metadata

## Overview

Normalize the current branch's GitHub PR metadata to this repo's expectations. Keep the title in conventional-commit style, keep the body aligned to the root `AGENTS.md` Pull Request Conventions, and validate before handoff.

Ground the PR metadata in the live branch state, not stale branch names or old commit subjects. Always inspect the current branch diff versus its base before rewriting the PR title/body.

Read [references/repo-pr-format.md](./references/repo-pr-format.md) when you need the repo's body guidance or a title example.

## Workflow

1. Determine whether the request is validation, drafting, or an authorized update. For an unpublished local draft, inspect the local diff and use explicit `--title` / `--body-file` input without contacting GitHub. Otherwise resolve the current branch PR, or the user's explicit PR target:

   ```bash
   gh pr view --json number,title,body,url,headRefName,baseRefName,headRefOid
   ```

   Stop on missing PRs, authentication failures, or ambiguous targets.

2. Inspect the current branch state against the PR base branch.

   At minimum, check:

   ```bash
   git status --short
   git diff --name-status origin/<base>...HEAD
   git diff --stat origin/<base>...HEAD
   git log --oneline --decorate --no-merges origin/<base>..HEAD
   ```

   Verify the checkout matches the PR head before using local diffs. Prefer `gh pr diff <number>` when local refs are missing, stale, or mismatched. Exclude unpublished local changes from claims about the published PR.

   Use these to answer:
   - what files actually differ from the base right now
   - which changes are functional versus cleanup/tooling/docs
   - whether the existing PR title/body still matches the current branch after rebases, reverts, or scope narrowing

3. Validate the current title and body.

   ```bash
   python3 .agents/skills/gh-pr-metadata/scripts/validate_pr_metadata.py
   ```

   Add `--pr <number-or-url>` for an explicit target. The helper checks title syntax and a non-empty body; review content against the diff and repository guidance yourself.

4. If a body scaffold is useful, print one:

   ```bash
   python3 .agents/skills/gh-pr-metadata/scripts/validate_pr_metadata.py --print-template
   ```

   This is an optional drafting aid, not a required heading/checklist format.

5. Rewrite the PR title in conventional-commit style.

   Rules:
   - Prefer `type(scope): summary`
   - Keep the title short and direct
   - Use types such as `fix`, `feat`, `docs`, `refactor`, `chore`, `test`, `ci`, `build`, `perf`, `revert`
   - Keep the scope tight to the affected package or subsystem when useful
   - Make sure the title describes the current branch diff, not the original branch intent if the branch was later narrowed or partially reverted

6. Rewrite the PR body following the repository's prose-first guidance:
   - what changed and why
   - user or runtime impact
   - validation that was run
   - failed or skipped checks, with cause

7. Update the PR with `gh` only when the user authorized an update. Validation or drafting requests are read-only.

   Preserve useful issue links and reviewer context. Re-read metadata before editing to reconcile concurrent changes. Write the body to a uniquely named temporary file in the environment's approved temporary directory, then:

   ```bash
   gh pr edit <number> --title "<new-title>" --body-file <body-file>
   ```

8. Re-read the saved PR and re-run validation:

   ```bash
   python3 .agents/skills/gh-pr-metadata/scripts/validate_pr_metadata.py --pr <number>
   ```

   Report its URL, whether metadata was updated, the exact checks and outcomes, and unresolved issues. This skill does not create PRs, commit, push, or merge.

## Body Guidance

- Keep the body prose-first and specific to the branch.
- Reflect the branch as it exists now, especially after rebases, cleanups, or partial reverts.
- Summarize the real file-level themes from the live diff instead of copying commit messages mechanically.
- Preserve useful issue references and reviewer context.
- Report tests as passed only when execution results support that claim.
- If the PR is docs-only, say so explicitly and keep the body brief.
- Keep the body concise; do not turn it into a changelog dump.

## Title Guidance

Good examples:

- `fix(react-utils): correct element size calculation`
- `feat(style-guide): add lint rule defaults`
- `docs(agents): clarify workspace checks`

Bad examples:

- `update pr`
- `fix stuff`

## Validation

Use the helper script to detect:

- non-conventional PR titles
- empty or comment-only PR bodies

The script validates either the current PR from `gh` or explicit `--title` / `--body-file` input. It does not validate evidence accuracy or impose mandatory body sections.
