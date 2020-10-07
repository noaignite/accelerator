import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { render } from 'test/utils'
import describeConformance from '../test-utils/describeConformance'
import MediaLoader from './MediaLoader'

describe('<MediaLoader />', () => {
  const mount = createMount()

  describeConformance(<MediaLoader />, () => ({
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
        <MediaLoader>
          <img src="foo.jpg" alt="" data-testid="img" />
        </MediaLoader>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
