import * as React from 'react'
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = createTheme({})

export const parameters = {
  layout: 'fullscreen',
  options: {
    storySort: {
      method: 'alphabetical',
    },
  },
}

export const decorators = [
  (Story) => (
    <EmotionThemeProvider
      // Bug: Custom theme not propagated within Storybook.js
      // https://github.com/mui-org/material-ui/issues/24282#issuecomment-859393395
      theme={theme}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    </EmotionThemeProvider>
  ),
]
