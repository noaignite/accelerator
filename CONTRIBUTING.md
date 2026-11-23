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

Before submitting, follow the [Pull Request Conventions](AGENTS.md#pull-request-conventions)
for the title and body.

## Formatting

Run `pnpm format` to format with [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)
or `pnpm format:check` to check without writing. The pre-commit hook formats staged
files; ESLint remains the linter.

Published Prettier presets and create-app templates are unchanged and excluded
from repository formatting.

## Adding a changeset to your Pull Request

Use the [Changeset Rules](AGENTS.md#changeset-rules) to choose package scope,
release type, or empty frontmatter. Include the generated file with the
corresponding changes.

For agent-assisted scope checks and PR metadata preparation, see
[changeset-pr](.agents/skills/changeset-pr/SKILL.md) and
[gh-pr-metadata](.agents/skills/gh-pr-metadata/SKILL.md).

Create a changeset:

```sh
pnpm changeset
```

Create an empty changeset:

```sh
pnpm changeset --empty
```

Add a short description to the empty changeset before submitting.

Package release example:

```md
---
'@noaignite/react-utils': patch
---

useElementSize: Fix faulty size computation.
```

Dependency update example:

```md
---
'@noaignite/style-guide': patch
---

Deps: Update `prettier-plugin-tailwindcss` from 0.7.2 to 0.8.0.
```

Empty-frontmatter example:

```md
---
---

Docs: Clarify contributor setup.
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

## Building packages and documentation

Root commands run unfiltered Turbo tasks:

| Command                    | Purpose                                                                    |
| -------------------------- | -------------------------------------------------------------------------- |
| `pnpm build`               | Build all packages and the docs site, including its search index.          |
| `pnpm dev`                 | Generate package docs and start docs development; no compilation required. |
| `pnpm start`               | Serve built apps; run `pnpm build` first.                                  |
| `pnpm packages:build`      | Build complete package artifacts, including `dist/docs`.                   |
| `pnpm packages:build-docs` | Generate package docs only.                                                |

Pass server options with `--`, e.g. `pnpm dev -- --port 3001` (also works for `start`).
For docs-only deployments, run `pnpm -F docs build` from the repository root.
Do not use direct `next build`: it skips content preparation, route checks, and search indexing.
Direct docs-app `dev` requires `pnpm packages:build-docs` first.

Turbo restores complete package and site outputs, including content and search.
Keep package docs after tsdown, which cleans `dist`. When adding a documented
package, update both `docs#build` and `docs#dev` prerequisites in `turbo.json`.

## CI

Valid PRs select affected builds, lint, types and package validators against the
actual target merge-base using the event's base/head snapshots. Invalid comparisons
visibly fall back to full validation; a valid zero affected plan is successful,
but CI still runs full coverage. Main and release validation remain full-scope.
Only newer runs of the same PR cancel obsolete runs; main and release are unaffected.

Existing local `pnpm build`, `pnpm test` and `pnpm ci:test` remain full-scope.
Opt into affected lint/types/unit checks and package validators with
`pnpm test:affected`. CI uses `pnpm ci:test:affected`, whose explicit `--ci` selects
full coverage instead of local unit checks; `CI=true` alone does not select CI policy.

Local comparisons default to local `main` and `HEAD`; override with
`TURBO_SCM_BASE` and `TURBO_SCM_HEAD`. Fetch the intended target first if needed.
Staged, unstaged and nonignored untracked edits participate even with an explicit
head; use a clean checkout for committed-only plans. Inspect without executing:

```sh
TURBO_SCM_BASE=origin/my-target TURBO_SCM_HEAD=HEAD pnpm test:affected --dry-run=json
```

Formatting (`pnpm format:check`) and coverage stay full-scope. Every executable
producer in Turbo's full coverage plan must supply `lcov.info` and
`coverage-summary.json`, including on cache restoration; missing reports fail.
Selected package validators always execute uncached, retaining build prerequisites.
Do not bypass prerequisites with `--only` or `--parallel`.

GitHub Actions archives Turbo's filesystem cache (`TURBO_CACHE=local:rw`) as the
deliberate final caching solution; no external cache service credentials are needed.
Cache misses or archive service failures execute required tasks normally; task,
report and applicable coverage-upload failures still fail CI. Fork PRs restore
caches but never save them. Release does not restore this CI cache.
Never put secrets in cached outputs or logs.

Keep `$TURBO_DEFAULT$`, shared helper/environment inputs and generated `outputs`
accurate, preserving runtime/platform compatibility safeguards and archive size limits.
When changing cache/output semantics, bump the cache schema in `.github/workflows/test.yml`.

## Validating package distributions

After `pnpm install`, run the packed-package checks from the repository root:

```sh
pnpm test:package
```

This builds the selected packages and their workspace dependencies before checking the
consumer-facing files, exports, declarations and type resolution with strict publint
and Are the Types Wrong (ATTW). Validation always runs, even when Turbo restores cached
builds. It complements lint, type and unit checks and is included in both `pnpm test`
and `pnpm ci:test`, including the existing release test chains.

Only these packages have this gate:

- `@noaignite/react-centra-checkout` and `@noaignite/tailwind-typography`: ATTW's
  `node16` profile checks their ESM and CommonJS entrypoints.
- `@noaignite/react-utils` and `@noaignite/utils`: ATTW's `esm-only` profile checks
  their ESM entrypoints.

To focus on one package while retaining the build prerequisites:

```sh
pnpm exec turbo test:package --filter=@noaignite/react-utils
```

Direct package scripts (for example, `pnpm -F @noaignite/react-utils test:package`)
assume that the package and its dependencies have already been built. Prefer the
Turbo-filtered command for a clean checkout. Each validator packs independently;
missing built files, strict publint warnings and ATTW failures fail the gate.
