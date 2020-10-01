import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import AspectRatio from './AspectRatio'

describe('<AspectRatio />', () => {
  let mount

  beforeAll(() => {
    mount = createMount()
  })

  afterAll(() => {
    mount.cleanUp()
  })

  it('should work', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(<AspectRatio />)
  })
})
