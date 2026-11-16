---
name: gh-pr-metadata
description: Validate, draft, or update GitHub PR titles and bodies to match Accelerator's conventions. Use for vague titles, incomplete bodies, or metadata corrections before review or merge.
---

# GH PR Metadata

Before validating, drafting, or editing metadata, read the
[Pull Request Conventions](../../../AGENTS.md#pull-request-conventions),
including the authorization policy.
Read [helper input and validation limits](./references/repo-pr-format.md) when
choosing local versus remote validation.

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

   Add `--pr <number-or-url>` for an explicit target. For a local draft, pass
   `--title "<title>" --body-file <body-file>` instead.

4. If a body scaffold is useful, print one:

   ```bash
   python3 .agents/skills/gh-pr-metadata/scripts/validate_pr_metadata.py --print-template
   ```

5. Draft the title and body against the current diff using the linked policy.
   Check each validation claim against execution results, rather than copying
   commit messages or stale branch intent.

6. Validate the draft using explicit local input. For validation or draft-only
   requests, report the result and stop here.

7. For an update request, confirm the authorization identified in step 1.
   Re-read metadata before editing to reconcile concurrent changes. Write the
   body to a uniquely named temporary file in the environment's approved
   temporary directory, then:

   ```bash
   gh pr edit <number> --title "<new-title>" --body-file <body-file>
   ```

8. Re-read the saved PR and re-run validation:

   ```bash
   python3 .agents/skills/gh-pr-metadata/scripts/validate_pr_metadata.py --pr <number>
   ```

   Report its URL, whether metadata was updated, the exact checks and outcomes, and unresolved issues. This skill does not create PRs, commit, push, or merge.
