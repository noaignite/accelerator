import * as React from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Preview } from '@storybook/react'

const theme = createTheme({})

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
