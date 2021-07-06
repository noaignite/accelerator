import * as React from 'react'
import { screen } from '@testing-library/react'
import { createRender, describeConformance } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import MediaLoader from './MediaLoader'

describe('<MediaLoader />', () => {
  const render = createRender({ wrapper: TestProvider })

  describeConformance(<MediaLoader />, () => ({
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      render(
        <MediaLoader>
          <img src="foo.jpg" alt="" data-testid="img" />
        </MediaLoader>,
      )
      expect(screen.getByTestId('img')).toBeInTheDocument()
    })
  })
})
