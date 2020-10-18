import * as React from 'react'
import { describeConformance, render } from 'test/utils'
import ScrollProgress from './ScrollProgress'

describe('<ScrollProgress />', () => {
  describeConformance(<ScrollProgress />, () => ({
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      const { getByTestId } = render(
        <ScrollProgress>
          <img src="foo.jpg" alt="" data-testid="img" />
        </ScrollProgress>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
