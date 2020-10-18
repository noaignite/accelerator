import * as React from 'react'
import { describeConformance, render } from 'test/utils'
import MediaLoader from './MediaLoader'

describe('<MediaLoader />', () => {
  describeConformance(<MediaLoader />, () => ({
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      const { getByTestId } = render(
        <MediaLoader>
          <img src="foo.jpg" alt="" data-testid="img" />
        </MediaLoader>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
