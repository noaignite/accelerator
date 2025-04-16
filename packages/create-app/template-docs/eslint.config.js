import reactConfig from '@noaignite/style-guide/eslint/react'
import storybook from 'eslint-plugin-storybook'

export default [...reactConfig, ...storybook.configs['flat/recommended']]
