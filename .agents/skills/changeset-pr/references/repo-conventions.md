# Repo Changesets Notes

## Current Config

Read `.changeset/config.json` for the base branch, fixed/linked groups, ignore list, and dependency update policy.

## Practical Implications

- A changeset that names one package can still produce broader releases through dependency propagation or configured release groups.
- `changeset status` verifies parsing and the combined release plan, but does not prove branch-local coverage because other pending changesets may exist.
- The scope helper compares branch changes with aggregate coverage and checks note descriptions, including empty-frontmatter notes.
- Package moves retain both base and current directory identities; moves/removals need review before choosing release scope. File paths alone do not determine semantic versioning.

## Prerequisites

The helpers require Python 3. Package discovery in working-tree mode also uses
the repository's installed pnpm; release planning uses Node and the local
`@changesets/cli` installation. Package identities come from workspace manifests,
not a cached list of Accelerator packages.

## Release Flow Notes

- Accelerator's existing release commands are in root `package.json`; inspect them and the live `.github/workflows/` configuration if release context is needed.
- For release-workflow changes, follow the root [Boundaries](../../../../AGENTS.md#boundaries); this reference describes inspection only.
