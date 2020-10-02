import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { describeConformance, render } from '../test-utils'
import ScrollProgress from './ScrollProgress'

describe('<ScrollProgress />', () => {
  const mount = createMount()

  describeConformance(<ScrollProgress />, () => ({
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
        <ScrollProgress>
          <img src="foo.jpg" alt="" data-testid="img" />
        </ScrollProgress>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
