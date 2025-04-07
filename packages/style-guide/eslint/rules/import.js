import importPlugin from 'eslint-plugin-import'

export default [
  {
    ...importPlugin.flatConfigs.recommended,
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
]
