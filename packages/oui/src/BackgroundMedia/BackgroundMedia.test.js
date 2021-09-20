import * as React from 'react'
import { createRender, describeConformance, getClasses } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import BackgroundMedia from './BackgroundMedia'

describe('<BackgroundMedia />', () => {
  const render = createRender({ wrapper: TestProvider })
  let classes

  beforeEach(() => {
    classes = getClasses(<BackgroundMedia />, render)
  })

  describeConformance(<BackgroundMedia />, () => ({
    classes,
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
  }))

  describe('should render with', () => {
    it('content of nested children', () => {
      const { getByTestId } = render(
        <BackgroundMedia data-testid="root">
          <img src="foo.jpg" alt="" data-testid="img" />
        </BackgroundMedia>,
      )

      expect(getByTestId('root')).toBeInTheDocument()
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
