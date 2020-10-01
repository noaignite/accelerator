import * as React from 'react'
import { getClasses, createMount } from '@material-ui/core/test-utils'
import { describeConformance, render } from '../test-utils'
import AspectRatio from './AspectRatio'

describe('<AspectRatio />', () => {
  const mount = createMount()
  let classes

  beforeAll(() => {
    classes = getClasses(<AspectRatio />)
  })

  describeConformance(<AspectRatio />, () => ({
    classes,
    inheritComponent: 'div',
    mount,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
  }))

  it('should render a div containing an div', () => {
    render(<AspectRatio width={1} height={1} />)
  })
})
