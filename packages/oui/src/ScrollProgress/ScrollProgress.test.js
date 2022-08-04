import * as React from 'react'
import { createRender, describeConformance, screen } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import ScrollProgress from './ScrollProgress'

describe('<ScrollProgress />', () => {
  const render = createRender({ wrapper: TestProvider })

  describeConformance(<ScrollProgress />, () => ({
    uiName: 'OuiScrollProgress',
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: ['themeDefaultProps', 'themeStyleOverrides'],
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      render(
        <ScrollProgress data-testid="root">
          <img src="/foo.jpg" alt="" />
        </ScrollProgress>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(root).toContainElement(img)
      expect(img).toHaveAttribute('src', '/foo.jpg')
    })
  })
})
