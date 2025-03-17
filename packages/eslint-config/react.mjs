import base from './base.mjs'
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  ...base,
  react.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: { react: { version: 'detect' } }
  }
]
