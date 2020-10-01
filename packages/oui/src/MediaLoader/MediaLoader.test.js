import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { describeConformance } from '../test-utils'
import MediaLoader from './MediaLoader'

describe('<MediaLoader />', () => {
  const mount = createMount()

  describeConformance(<MediaLoader />, () => ({
    inheritComponent: 'div',
    mount,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
    skip: ['rootClass'],
  }))
  mount.cleanUp()

  it('should render a div with content of nested children', () => {
    const wrapper = mount(
      <MediaLoader>
        <img src="foo.jpg" alt="" />
      </MediaLoader>,
    )
    expect(wrapper.contains(<img src="foo.jpg" alt="" />)).toEqual(true)
  })
})
