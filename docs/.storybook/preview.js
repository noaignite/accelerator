import * as React from 'react'
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'

const theme = createTheme({
  components: {
    OuiAspectRatio: {
      styleOverrides: {
        root: {
          marginTop: 200,
        },
      },
    },
  },
})

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
