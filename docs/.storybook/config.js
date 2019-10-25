import React from 'react'
import { addDecorator, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import MuiThemeProvider from '@material-ui/styles/ThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import CssBaseline from '@material-ui/core/CssBaseline'

const req = require.context('../src', true, /\/stories\.js$/)
const theme = createMuiTheme({})

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

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
configure(loadStories, module)
