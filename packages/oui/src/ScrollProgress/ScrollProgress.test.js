import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { describeConformance } from '../test-utils'
import ScrollProgress from './ScrollProgress'

describe('<ScrollProgress />', () => {
  const mount = createMount()

  describeConformance(<ScrollProgress />, () => ({
    inheritComponent: 'div',
    mount,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))
  mount.cleanUp()

  it('should render a div with content of nested children', () => {
    const wrapper = mount(
      <ScrollProgress>
        <img src="foo.jpg" alt="" />
      </ScrollProgress>,
    )
    expect(wrapper.contains(<img src="foo.jpg" alt="" />)).toEqual(true)
  })
})
