import * as React from 'react'
import { describeConformance, getClasses, render } from 'test/utils'
import AspectRatio from './AspectRatio'

describe('<AspectRatio />', () => {
  let classes

  beforeEach(() => {
    classes = getClasses(<AspectRatio />)
  })

  describeConformance(<AspectRatio />, () => ({
    classes,
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
  }))

  describe('should render with', () => {
    it('no children', () => {
      const { getByTestId } = render(<AspectRatio data-testid="root" />)
      expect(getByTestId('root')).toBeEmptyDOMElement()
    })

    it('children', () => {
      const { getByTestId } = render(<AspectRatio width={1} height={1} data-testid="root" />)
      expect(getByTestId('root')).not.toBeEmptyDOMElement()
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
