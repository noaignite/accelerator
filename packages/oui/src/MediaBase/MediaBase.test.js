import * as React from 'react'
import { screen } from '@testing-library/react'
import { createRender, describeConformance } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import MediaBase from './MediaBase'

describe('<MediaBase />', () => {
  const render = createRender({ wrapper: TestProvider })

  describeConformance(<MediaBase src="/foo.jpg" />, () => ({
    inheritComponent: 'img',
    refInstanceof: window.HTMLImageElement,
    render,
    testComponentPropWith: 'picture',
  }))

  describe('should render with', () => {
    it('the `src` attribute specified', () => {
      render(<MediaBase src="/foo.jpg" />)
      expect(screen.getByRole('img')).toHaveAttribute('src', '/foo.jpg')
    })

    it('no `src` attribute when `lazy` is specified', () => {
      render(<MediaBase src="/foo.jpg" lazy />)
      expect(screen.getByRole('img')).not.toHaveAttribute('src', '/foo.jpg')
    })

    it('content of nested children', () => {
      render(
        <MediaBase component="picture">
          <img src="foo.jpg" alt="" />
        </MediaBase>,
      )
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })
})
