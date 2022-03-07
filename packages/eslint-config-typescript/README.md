# @noaignite/eslint-config-typescript

This package includes the shareable ESLint configuration used by [NoA Ignite](https://noaignite.se/).

## Installation

ESLint Ignite is available as an [npm package](https://www.npmjs.com/package/@noaignite/eslint-config-typescript).

```sh
// with npm
npm install @noaignite/eslint-config-typescript

// with yarn
yarn add @noaignite/eslint-config-typescript
```

Then create a file named `.eslintrc.json` with following contents in the root folder of your project:

```json
{
  "extends": "@noaignite/eslint-config-typescript"
}
```

That's it! You can override the settings from `@noaignite/eslint-config-typescript` by editing the `.eslintrc.json` file. Learn more about [configuring ESLint](https://eslint.org/docs/user-guide/configuring) on the ESLint website.
