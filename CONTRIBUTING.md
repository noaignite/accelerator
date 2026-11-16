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
