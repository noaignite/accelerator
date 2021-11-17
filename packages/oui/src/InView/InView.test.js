import * as React from 'react'
import { screen } from '@testing-library/react'
import { createRender, describeConformance } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import InView from '.'

describe('<InView />', () => {
  const render = createRender({ wrapper: TestProvider })

  describeConformance(<InView />, () => ({
    ouiName: 'OuiInView',
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: ['themeStyleOverrides'],
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      render(
        <InView data-testid="root">
          <img src="/foo.jpg" alt="" />
        </InView>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(root).toContainElement(img)
      expect(img).toHaveAttribute('src', '/foo.jpg')
    })
  })
})
