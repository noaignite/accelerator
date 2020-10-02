import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { describeConformance, render } from '../test-utils'
import InView from './InView'

describe('<InView />', () => {
  const mount = createMount()

  describeConformance(<InView />, () => ({
    inheritComponent: 'div',
    mount,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))
  mount.cleanUp()

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
