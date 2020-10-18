// Based on: https://testing-library.com/docs/react-testing-library/setup#custom-render

import { render as rtlRender } from '@testing-library/react'
import TestProvider from './TestProvider'

export default function render(ui, options) {
  return rtlRender(ui, { wrapper: TestProvider, ...options })
}
