import * as React from 'react'
import { getClasses, createMount } from '@material-ui/core/test-utils'
import { render } from 'test/utils'
import describeConformance from '../test-utils/describeConformance'
import BackgroundMedia from './BackgroundMedia'

describe('<BackgroundMedia />', () => {
  const mount = createMount()
  let classes

  beforeAll(() => {
    classes = getClasses(<BackgroundMedia />)
  })

  describeConformance(<BackgroundMedia />, () => ({
    classes,
    inheritComponent: 'div',
    mount,
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp'],
  }))
  mount.cleanUp()

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
