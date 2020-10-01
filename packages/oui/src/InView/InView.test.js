import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import InView from './InView'

describe('<InView />', () => {
  let mount

  beforeAll(() => {
    mount = createMount()
  })

  afterAll(() => {
    mount.cleanUp()
  })

  it('should work', () => {
    // eslint-disable-next-line no-unused-vars
    const wrapper = mount(<InView />)
  })
})
