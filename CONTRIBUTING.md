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
Prefer root commands: direct docs-app `build`/`dev` require prepared package docs,
and direct `next build` skips the Pagefind postbuild lifecycle.

Turbo restores complete package and site outputs, including content and search.
Keep package docs after tsdown, which cleans `dist`. When adding a documented
package, update both `docs#build` and `docs#dev` prerequisites in `turbo.json`.

### CI task caching

Test CI still runs the full build, then sequential lint, types, coverage and all four
uncached package validators. GitHub Actions restores only `.turbo/ci-cache`; Turbo
decides individual task hits from inputs and dependency build hashes. A cache miss
or cache-service failure runs the normal tasks. The existing pnpm cache is separate.
Release/publish and Slack workflows do not consume this task cache.

Main seeds base caches. Same-repository PRs save in GitHub's PR-isolated scope;
fork PRs only restore eligible base caches. Never put credentials in task outputs
or logs: base caches are readable by fork PRs.

Keys and their only restore prefix include the resolved Node version, OS/architecture,
runner image/version, UTC calendar year (rendered by docs), and schema version.
When changing output/cache semantics, bump `schema` in `scripts/turboCache.ts`.
Keep `$TURBO_DEFAULT$` in custom inputs; add imported root helpers explicitly.
Generated outputs belong in `outputs`, not source inputs. Changes to shared build,
docs and Vitest helpers must invalidate their consumers. Don't run `build` and
`build:docs` concurrently: both own package docs and tsdown cleans `dist`.

Snapshots retain only hashes used in the current successful job, not accumulated
task history. Task-cache directories above 256 MiB are not saved. Each compatible
commit gets at most one immutable snapshot per GitHub scope. Entries still compete
with pnpm caches for the repository's included 10 GiB; GitHub expires/evicts them,
so hits are not guaranteed. No cache deletion permissions, storage-limit increases
or paid services are needed. Job summaries report snapshot bytes and restore/save
overhead; action logs report compressed transfer size and time.

For an isolated local reproduction, set `TURBO_CACHE_DIR=.turbo/ci-cache` and
`TURBO_CACHE=local:rw` before `pnpm build` and `pnpm ci:test`. This also avoids
Turbo's default cache sharing across worktrees. Run cache tooling regression tests
with `node --test scripts/*.test.ts`.

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
