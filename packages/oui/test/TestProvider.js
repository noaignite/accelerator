import * as React from 'react'
import PropTypes from 'prop-types'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({})

function TestProvider(props) {
  const { children, ...other } = props

  return (
    <ThemeProvider theme={theme} {...other}>
      {children}
    </ThemeProvider>
  )
}

TestProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TestProvider
