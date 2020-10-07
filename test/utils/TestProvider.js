import * as React from 'react'
import PropTypes from 'prop-types'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({})

function TestProvider(props) {
  const { children } = props

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

TestProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TestProvider
