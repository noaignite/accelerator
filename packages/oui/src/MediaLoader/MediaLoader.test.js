import * as React from 'react'
import { screen } from '@testing-library/react'
import { createRender, describeConformance } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import MediaLoader from '.'

describe('<MediaLoader />', () => {
  const render = createRender({ wrapper: TestProvider })

  describeConformance(<MediaLoader />, () => ({
    ouiName: 'OuiMediaLoader',
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
