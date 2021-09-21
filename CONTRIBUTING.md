# Contributing to OUI

Thank you for helping out!

## Environment

The project is dependent on Node v12.x.x in order to run in development. It is recommended to have [nvm](https://github.com/nvm-sh/nvm#node-version-manager---) installed to conveniently manage your node versions between projects. Once you have it installed you can install the node version denoted in the `.nvmrc` file.

```bash
nvm use
```

## Sending a Pull Request

1. Install the dependencies:

```sh
yarn install
```

2. Create a new topic branch:

```sh
git checkout -b my-topic-branch
```

3. Make changes, commit and push your branch:

```sh
git push -u origin HEAD
```

4. Go to [the repository](https://github.com/noaignite/oui) and make a Pull Request.

### Trying the changes on the documentation site

The documentation site is built with Material-UI and contains examples of all the components.
This is a great place to experiment with your changes.

To get started:

```sh
yarn
yarn start
```

You can now access the documentation site [locally](http://localhost:3001).

Where possible, please add tests for any changes you make.
Tests can be run with `yarn test`.
