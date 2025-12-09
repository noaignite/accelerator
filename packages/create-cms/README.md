# @noaignite/create-cms

Initializes a prompt-based setup process to scaffold specific templates within a turborepo project. It guides users through selecting templates, handling file overwrites, and running associated commands.

The function:

- Displays the CLI help message when run with the `--help` or `-h` flag.
- Prompts the user for the root directory of the turborepo, and checks for the presence of the `turbo.json` file.
- Allows the user to select from predefined templates to install.
- Handles file overwrites based on user choice.
- Copies the template files into the designated directories and executes any custom commands defined in the templates.
- Installs project dependencies.

- @throws Error if a required file is missing, no templates are selected, or the operation is cancelled.

## Usage

Install the package in your project directory with:

```sh
// with pnpm (recommended)
pnpm dlx @noaignite/create-cms

// with yarn
yarn dlx @noaignite/create-cms

// with npm
npx @noaignite/create-cms
```

## Documentation

Visit [https://noaignite.dev](https://noaignite.dev) to view the full documentation.
