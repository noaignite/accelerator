import * as React from 'react'
import { createRender, describeConformance, getClasses } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import MediaBase from './MediaBase'

describe('<MediaBase />', () => {
  const render = createRender({ wrapper: TestProvider })
  let classes

  beforeEach(() => {
    classes = getClasses(<MediaBase src="/foo.jpg" />, render)
  })

  describeConformance(<MediaBase src="/foo.jpg" />, () => ({
    classes,
    inheritComponent: 'img',
    refInstanceof: window.HTMLImageElement,
    render,
    testComponentPropWith: 'picture',
  }))

  describe('should render with', () => {
    it('the `src` attribute specified', () => {
      const { getByRole } = render(<MediaBase src="/foo.jpg" />)
      expect(getByRole('img')).toHaveAttribute('src', '/foo.jpg')
    })

    it('no `src` attribute when `lazy` is specified', () => {
      const { getByRole } = render(<MediaBase src="/foo.jpg" lazy />)
      expect(getByRole('img')).not.toHaveAttribute('src', '/foo.jpg')
    })

    it('content of nested children', () => {
      const { getByRole } = render(
        <MediaBase component="picture">
          <img src="foo.jpg" alt="" />
        </MediaBase>,
      )
      expect(getByRole('img')).toBeInTheDocument()
    })
  })
})
