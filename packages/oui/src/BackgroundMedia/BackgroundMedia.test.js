import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import BackgroundMedia from './BackgroundMedia'

describe('<BackgroundMedia />', () => {
  let mount

  beforeAll(() => {
    mount = createMount()
  })

  afterAll(() => {
    mount.cleanUp()
  })

  it('should work', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(<BackgroundMedia />)
  })
})
