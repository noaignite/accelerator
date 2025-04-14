import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  {
    ...jsxA11y.flatConfigs.recommended,
    name: '@noaignite/style-guide/jsx-a11y',
  },
  {
    ...pluginReact.configs.flat.recommended,
    name: '@noaignite/style-guide/react',
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    name: '@noaignite/style-guide/react-hooks',
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReactHooks.configs['recommended-latest'].rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
    },
  },
]
