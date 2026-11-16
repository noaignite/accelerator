# Repo Changesets Notes

## Current Config

Read `.changeset/config.json` for the base branch, fixed/linked groups, ignore list, and dependency update policy. Read the root `AGENTS.md` Changeset Rules for this repository's package-scope and empty-changeset requirements.

## Practical Implications

- Every PR requires a changeset. Non-package-only and test-only changes use empty frontmatter and a short description. Packages with only test-file changes do not need a package release entry; follow root `AGENTS.md` for test-file conventions.
- Private workspaces and ignored packages are not package release entries.
- A changeset that names one package can still produce broader releases through dependency propagation or configured release groups.
- `changeset status` verifies parsing and the combined release plan, but does not prove branch-local coverage because other pending changesets may exist.
- Use the scope helper to compare branch changes with aggregate coverage. Package moves retain both base and current directory identities; moves/removals need review before choosing release scope.

## Relevant Repo Commands

The helpers require Python 3. Package discovery in working-tree mode also uses
the repository's installed pnpm; release planning uses Node and the local
`@changesets/cli` installation. Package identities come from workspace manifests,
not a cached list of Accelerator packages.

```bash
pnpm changeset
pnpm exec changeset status
python3 .agents/skills/changeset-pr/scripts/inspect_changeset_scope.py --base origin/main
python3 .agents/skills/changeset-pr/scripts/inspect_changeset_scope.py --base origin/main --include-working-tree
python3 .agents/skills/changeset-pr/scripts/run_changeset_status.py --verbose
```

## Release Flow Notes

- Accelerator's existing release commands are in root `package.json`; inspect them and the live `.github/workflows/` configuration if release context is needed.
- These helpers inspect coverage and release planning only. Do not run publish commands or modify CI/release workflows unless the user explicitly authorizes that work.

## Helper Regression Checks

Run `python3 -m unittest discover -s scripts/tests -v` from the repository root.
Fixtures are temporary repositories; PR tests substitute a local `gh` executable and never mutate GitHub.
