import * as React from 'react'
import { getClasses, createMount } from '@material-ui/core/test-utils'
import { render } from 'test/utils'
import describeConformance from '../test-utils/describeConformance'
import AspectRatio from './AspectRatio'

describe('<AspectRatio />', () => {
  const mount = createMount()
  let classes

  beforeAll(() => {
    classes = getClasses(<AspectRatio />)
  })

  describeConformance(<AspectRatio />, () => ({
    classes,
    inheritComponent: 'div',
    mount,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
  }))
  mount.cleanUp()

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
