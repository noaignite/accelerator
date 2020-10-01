import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import MediaReveal from './MediaReveal'

describe('<MediaReveal />', () => {
  let mount

  beforeAll(() => {
    mount = createMount()
  })

  afterAll(() => {
    mount.cleanUp()
  })

  it('should work', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(
      <MediaReveal>
        <img src="//source.unsplash.com/1920x1080" alt="" />
      </MediaReveal>,
    )
  })
})
