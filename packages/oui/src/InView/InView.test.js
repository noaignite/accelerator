import * as React from 'react'
import { describeConformance, render } from 'test/utils'
import InView from './InView'

describe('<InView />', () => {
  describeConformance(<InView />, () => ({
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      const { getByTestId } = render(
        <InView data-testid="root">
          <img src="foo.jpg" alt="" data-testid="img" />
        </InView>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
