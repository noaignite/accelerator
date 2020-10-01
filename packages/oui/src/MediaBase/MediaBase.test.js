import * as React from 'react'
import { getClasses, createMount } from '@material-ui/core/test-utils'
import { describeConformance } from '../test-utils'
import MediaBase from './MediaBase'

describe('<MediaBase />', () => {
  const mount = createMount()
  let classes

  beforeAll(() => {
    classes = getClasses(<MediaBase src="/foo.jpg" />)
  })

  describeConformance(<MediaBase src="/foo.jpg" />, () => ({
    classes,
    inheritComponent: 'img',
    mount,
    refInstanceof: window.HTMLImageElement,
    testComponentPropWith: 'picture',
  }))
  mount.cleanUp()

  it('should render a picture with content of nested children', () => {
    const wrapper = mount(
      <MediaBase component="picture">
        <img src="foo.jpg" alt="" />
      </MediaBase>,
    )
    expect(wrapper.contains(<img src="foo.jpg" alt="" />)).toEqual(true)
  })
})
