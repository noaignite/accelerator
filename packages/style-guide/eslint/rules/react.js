import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  {
    ...jsxA11y.flatConfigs.recommended,
    name: '@noaignite/style-guide/eslint/jsx-a11y',
  },
  {
    ...pluginReact.configs.flat.recommended,
    name: '@noaignite/style-guide/eslint/react',
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    name: '@noaignite/style-guide/eslint/react-hooks',
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

      // React Compiler rules
      // TODO: Consider enabling for next major release.
      'react-hooks/config': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/component-hook-factories': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/incompatible-library': 'off',

      'react/react-in-jsx-scope': 'off', // React scope no longer necessary with new JSX transform.
    },
  },
]
