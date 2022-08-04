import * as React from 'react'
import { createRender, describeConformance, screen } from 'test/utils'
import MediaLoader from '.'

describe('<MediaLoader />', () => {
  const render = createRender()

  describeConformance(<MediaLoader />, () => ({
    uiName: 'OuiMediaLoader',
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: ['themeDefaultProps', 'themeStyleOverrides'],
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      render(
        <MediaLoader data-testid="root">
          <img src="/foo.jpg" alt="" />
        </MediaLoader>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(root).toContainElement(img)
      expect(img).toHaveAttribute('src', '/foo.jpg')
    })
  })
})
