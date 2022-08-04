import * as React from 'react'
import { createRender, describeConformance, screen } from 'test/utils'
import MediaBase from '.'

describe('<MediaBase />', () => {
  const render = createRender()

  describeConformance(<MediaBase src="/foo.jpg" />, () => ({
    uiName: 'OuiMediaBase',
    inheritComponent: 'img',
    refInstanceof: window.HTMLImageElement,
    render,
    testComponentPropWith: 'picture',
  }))

  describe('should render with', () => {
    it('the `src` attribute specified', () => {
      render(<MediaBase src="/foo.jpg" data-testid="root" />)
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(root).toBe(img)
      expect(root).toHaveAttribute('src', '/foo.jpg')
    })

    it('content of nested children when `component="picture"` is specified', () => {
      render(
        <MediaBase component="picture" data-testid="root">
          <img src="/foo.jpg" alt="" />
        </MediaBase>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(root).toContainElement(img)
      expect(img).toHaveAttribute('src', '/foo.jpg')
    })

    it('no `src` attribute when `lazy` is specified', () => {
      render(<MediaBase src="/foo.jpg" lazy data-testid="root" />)
      const root = screen.getByTestId('root')

      expect(root).not.toHaveAttribute('src')
    })

    it('the `src` attribute set by `placeholder` when `lazy` is specified', () => {
      render(<MediaBase src="/foo.jpg" placeholder="/bar.jpg" lazy data-testid="root" />)
      const root = screen.getByTestId('root')

      expect(root).toHaveAttribute('src', '/bar.jpg')
    })
  })
})
