import * as React from 'react'
import { getClasses, createMount } from '@material-ui/core/test-utils'
import { describeConformance, render } from '../test-utils'
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

  it('should render a div containing the container & wrapper divs', () => {
    const { getByTestId } = render(<BackgroundMedia />)
    expect(getByTestId('container')).toBeInTheDocument()
    expect(getByTestId('wrapper')).toBeInTheDocument()
  })

  it('should render a div with content of nested children', () => {
    const wrapper = mount(
      <BackgroundMedia>
        <img src="foo.jpg" alt="" />
      </BackgroundMedia>,
    )
    expect(wrapper.contains(<img src="foo.jpg" alt="" />)).toEqual(true)
  })
})
