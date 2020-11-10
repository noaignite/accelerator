import * as React from 'react'
import { createRender, describeConformance, getClasses } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import AspectRatio from './AspectRatio'

describe('<AspectRatio />', () => {
  const render = createRender({ wrapper: TestProvider })
  let classes

  beforeEach(() => {
    classes = getClasses(<AspectRatio />, render)
  })

  describeConformance(<AspectRatio />, () => ({
    classes,
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
  }))

  describe('should render with', () => {
    it('className `ratio` if `width` & `height` are specified', () => {
      const { getByTestId } = render(<AspectRatio width={1} height={1} data-testid="root" />)
      expect(getByTestId('root')).toHaveClass(classes.ratio)
    })

    it('className `ratio` if `ratio` is specified', () => {
      const { getByTestId } = render(<AspectRatio ratio={1} data-testid="root" />)
      expect(getByTestId('root')).toHaveClass(classes.ratio)
    })

    it('content of nested children', () => {
      const { getByTestId } = render(
        <AspectRatio data-testid="root">
          <img src="foo.jpg" alt="" data-testid="img" />
        </AspectRatio>,
      )
      expect(getByTestId('root').tagName).toEqual('DIV')
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
