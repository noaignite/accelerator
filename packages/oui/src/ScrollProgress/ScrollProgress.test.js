import * as React from 'react'
import { screen } from '@testing-library/react'
import { createRender, describeConformance } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import ScrollProgress from './ScrollProgress'

describe('<ScrollProgress />', () => {
  const render = createRender({ wrapper: TestProvider })

  describeConformance(<ScrollProgress />, () => ({
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      render(
        <ScrollProgress>
          <img src="foo.jpg" alt="" data-testid="img" />
        </ScrollProgress>,
      )
      expect(screen.getByTestId('img')).toBeInTheDocument()
    })
  })
})
