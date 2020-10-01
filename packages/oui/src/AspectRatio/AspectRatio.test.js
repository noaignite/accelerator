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

  describe('should render a div containing', () => {
    it('0 children', () => {
      const { container } = render(<AspectRatio />)
      const aspectRatio = container.firstChild
      expect(aspectRatio.children.length).toEqual(0)
    })

    it('1 child', () => {
      const { container } = render(<AspectRatio width={1} height={1} />)
      const aspectRatio = container.firstChild
      expect(aspectRatio.children.length).toEqual(1)
    })
  })
})
