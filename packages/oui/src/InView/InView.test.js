import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { describeConformance } from '../test-utils'
import InView from './InView'

describe('<InView />', () => {
  const mount = createMount()

  describeConformance(<InView />, () => ({
    inheritComponent: 'div',
    mount,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))
  mount.cleanUp()

  it('should render a div with content of nested children', () => {
    const wrapper = mount(
      <InView>
        <img src="foo.jpg" alt="" />
      </InView>,
    )
    expect(wrapper.contains(<img src="foo.jpg" alt="" />)).toEqual(true)
  })
})
