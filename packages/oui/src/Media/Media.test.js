import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { describeConformance } from '../test-utils'
import Media from './Media'

describe('<Media />', () => {
  const mount = createMount()

  describeConformance(<Media />, () => ({
    inheritComponent: 'img',
    mount,
    refInstanceof: window.HTMLImageElement,
    testComponentPropWith: 'picture',
    skip: ['rootClass'],
  }))
  mount.cleanUp()
})
