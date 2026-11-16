# Contributing

Thank you for helping out!

## Environment

The project is dependent on the Node version denoted in the `.nvmrc` file in order to run in development. It is recommended to have [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#node-version-manager---) installed to conveniently manage your node versions between projects. Once you have it installed you can install the node version denoted in the `.nvmrc` file.

```bash
nvm use
```

## Sending a Pull Request

1. Install the dependencies with pnpm (yarn or npm aren't supported):

```sh
pnpm install
```

2. Create a new topic branch:

```sh
git checkout -b my-topic-branch
```

3. Make changes, commit and push your branch:

```sh
git push
```

> It is recommended to use [conventional commits](https://www.conventionalcommits.org/).

4. Go to [the repository](https://github.com/noaignite/accelerator) and make a Pull Request.

Prefer a conventional-commit-style title, `type(scope): short summary`. Write a
prose-first body explaining what changed, why, user or runtime impact, actual
validation, and any failed or skipped checks with causes. For docs-only work,
say so explicitly and keep the body brief. Preserve useful issue links and
reviewer context; no particular headings or checklists are required.

## Adding a changeset to your Pull Request

Every Pull Request needs a changeset. Include entries for packages under
`packages/*` with non-test changes; those entries cause package version bumps.
Non-package and test-only changes use an empty-frontmatter changeset with a short
description and do not cause a version bump. Test files are `*.test.*`,
`*.spec.*`, Python `test_*.py` / `*_test.py`, and files under `test/`,
`__tests__/`, or `__snapshots__/`. Mixed PRs need entries only for packages
with non-test changes; runtime/API, dependency, and packaging changes still need
package coverage. Include the changeset with the corresponding changes.

For agent-assisted scope checks and PR metadata preparation, see
[changeset-pr](.agents/skills/changeset-pr/SKILL.md) and
[gh-pr-metadata](.agents/skills/gh-pr-metadata/SKILL.md). Validation and drafting
are read-only; GitHub metadata updates require user authorization.

Create a changeset:

```sh
pnpm changeset
```

Create an empty changeset:

```sh
pnpm changeset --empty
```

<!--
### Trying the changes on the documentation site

The documentation site is built with [framework] and contains examples.
This is a great place to experiment with your changes.

To get started:

```sh
pnpm dev
```

You can now access the documentation site [locally](http://localhost:3000).
 -->

Where possible, please add tests for any changes you make.
Tests can be run locally with `pnpm test`.
