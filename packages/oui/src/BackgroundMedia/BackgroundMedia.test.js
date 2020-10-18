import * as React from 'react'
import { describeConformance, getClasses, render } from 'test/utils'
import BackgroundMedia from './BackgroundMedia'

describe('<BackgroundMedia />', () => {
  let classes

  beforeEach(() => {
    classes = getClasses(<BackgroundMedia />)
  })

  describeConformance(<BackgroundMedia />, () => ({
    classes,
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    skip: ['componentProp'],
  }))

  describe('should render with', () => {
    it('the container & wrapper divs', () => {
      const { getByTestId } = render(<BackgroundMedia data-testid="root" />)
      expect(getByTestId('container')).toBeInTheDocument()
      expect(getByTestId('wrapper')).toBeInTheDocument()
    })

    it('content of nested children', () => {
      const { getByTestId } = render(
        <BackgroundMedia data-testid="root">
          <img src="foo.jpg" alt="" data-testid="img" />
        </BackgroundMedia>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
