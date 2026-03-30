# @noaignite/react-native-eslint

A comprehensive ESLint configuration for React Native projects with TypeScript support. It provides a tested, opinionated set of ESLint rules tailored for React Native development.

## Features

- 🚀 React Native optimized rules
- 📱 TypeScript support with strict type checking
- ⚡ ESLint 9 flat config format
- 🎯 Jest testing rules included
- 🎨 Stylistic rules for consistent code formatting
- 🔧 Promise-based async/await best practices
- 🛡️ Security-focused React rules

## Installation

```bash
npm install --save-dev @noaignite/react-native-eslint
```

Or with yarn:

```bash
yarn add --dev @noaignite/react-native-eslint
```

## Usage

Create an `eslint.config.js` file in your project root:

```javascript
import reactNativeConfig from '@noaignite/react-native-eslint'

export default reactNativeConfig
```

Or extend it with additional configuration:

```javascript
import reactNativeConfig from '@noaignite/react-native-eslint'

export default [
  ...reactNativeConfig,
  {
    // Your custom rules here
    rules: {
      // Override or add rules
      'no-console': 'warn',
    },
  },
]
```

## What's Included

This configuration includes rules for:

- **JavaScript/TypeScript**: Core language rules and TypeScript-specific linting
- **React**: React best practices and hooks rules
- **React Native**: Platform-specific rules for React Native development
- **Jest**: Testing rules and best practices
- **Promises**: Async/await and Promise handling
- **Stylistic**: Code formatting and style consistency

## Usage

Create eslint.config.js file in your project root, import eslintConfig from package.

```javascript
import eslintConfig from '@noaignite/react-native-eslint'

export default eslintConfig
```

Use a config object if your project want to apply new rules.

```javascript
import eslintConfig from '@noaignite/react-native-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    extends: eslintConfig,
    rules: {
      // add new rules here
    },
  },
])
```

Use a config array If your project want to combine with other package's eslint config.

```javascript
import eslintConfig from '@noaignite/react-native-eslint'
import otherEslintConfig from '@other/package'
import { defineConfig } from 'eslint/config'

export default defineConfig([...eslintConfig, ...otherEslintConfig])
```

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## Requirements

- Node.js >= 18.0.0
- ESLint >= 9.0.0
- TypeScript project

## Documentation

Visit [https://noaignite.dev/react-native-eslint](https://noaignite.dev/react-native-eslint) to view the full documentation.

## Contributing

Read the [contributing guide](https://github.com/noaignite/accelerator/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Changelog

The [changelog](https://github.com/noaignite/accelerator/releases) is regularly updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the [MIT license](https://github.com/noaignite/accelerator/blob/main/LICENSE).
