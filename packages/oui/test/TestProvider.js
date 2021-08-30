import * as React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createTheme({})

function TestProvider(props) {
  const { children, ...other } = props

  return (
    <EmotionThemeProvider
      // Bug: Custom theme not propagated within Storybook.js
      // https://github.com/mui-org/material-ui/issues/24282#issuecomment-859393395
      theme={theme}
    >
      <ThemeProvider theme={theme} {...other}>
        {children}
      </ThemeProvider>
    </EmotionThemeProvider>
  )
}

TestProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TestProvider
