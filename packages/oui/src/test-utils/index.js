// Based on: https://testing-library.com/docs/react-testing-library/setup#custom-render

import * as React from 'react'
import { render } from '@testing-library/react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({})
// eslint-disable-next-line react/prop-types
const AllTheProviders = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
export { default as describeConformance } from './describeConformance'
