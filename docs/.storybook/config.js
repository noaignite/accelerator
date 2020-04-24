import React from 'react'
import { addDecorator, addParameters, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { withA11y } from '@storybook/addon-a11y'
import MuiThemeProvider from '@material-ui/styles/ThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import CssBaseline from '@material-ui/core/CssBaseline'

const req = require.context('../src', true, /\/stories\.js$/)
const theme = createMuiTheme({})

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

addParameters({
  options: {
    storySort: (a, b) => {
      if (a[1].kind === b[1].kind) {
        return 0
      }

      return a[1].id.localeCompare(b[1].id, { numeric: true })
    },
  },
})

addDecorator(story => {
  const content = story()
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {content}
    </MuiThemeProvider>
  )
})
addDecorator(withKnobs)
addDecorator(withA11y)

configure(loadStories, module)
