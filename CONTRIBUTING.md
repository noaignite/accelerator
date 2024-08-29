# Contributing

Thank you for helping out!

## Environment

The project is dependent on Node v20.x.x in order to run in development. It is recommended to have [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#node-version-manager---) installed to conveniently manage your node versions between projects. Once you have it installed you can install the node version denoted in the `.nvmrc` file.

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

4. Go to [the repository](https://github.com/noaignite/accelerator) and make a Pull Request.

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
Tests can be run with `pnpm test`.
