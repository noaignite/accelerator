import * as React from 'react'
import { createMount } from '@material-ui/core/test-utils'
import { describeConformance, render } from '../test-utils'
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

  describe('should render with', () => {
    it('the `src` attribute specified', () => {
      const { getByTestId } = render(<Media src="/foo.jpg" data-testid="root" />)
      expect(getByTestId('root')).toHaveAttribute('src', '/foo.jpg')
    })

    it('no `src` attribute when `lazy` is specified', () => {
      const { getByTestId } = render(<Media src="/foo.jpg" lazy data-testid="root" />)
      expect(getByTestId('root')).not.toHaveAttribute('src', '/foo.jpg')
    })

    it('no img attributes when `component="picture"` is specified', () => {
      const { getByTestId } = render(
        <Media
          component="picture"
          alt="Hello"
          height="100"
          width="100"
          loading="lazy"
          srcSet="/foo-480w.jpg 480w, /foo-800w.jpg 800w"
          sizes="(max-width: 600px) 480px, 800px"
          src="foo-800w.jpg"
          data-testid="root"
        />,
      )
      expect(getByTestId('root')).not.toHaveAttribute('alt')
      expect(getByTestId('root')).not.toHaveAttribute('height')
      expect(getByTestId('root')).not.toHaveAttribute('loading')
      expect(getByTestId('root')).not.toHaveAttribute('sizes')
      expect(getByTestId('root')).not.toHaveAttribute('src')
      expect(getByTestId('root')).not.toHaveAttribute('srcSet')
      expect(getByTestId('root')).not.toHaveAttribute('width')
    })

    it('source & img content when `component="picture"` & `breakpoints` is specified', () => {
      const { getByTestId } = render(
        <Media
          component="picture"
          breakpoints={{
            xs: '/foo.jpg',
          }}
          data-testid="root"
        />,
      )
      expect(getByTestId('root')).not.toBeEmptyDOMElement()
      expect(getByTestId('root').getElementsByTagName('source').length > 0).toEqual(true)
      expect(getByTestId('root').getElementsByTagName('img').length > 0).toEqual(true)
    })

    // it('no children & the `src` attribute specified', () => {
    //   const { getByTestId } = render(
    //     <Media
    //       breakpoints={{
    //         xs: '/foo.jpg',
    //       }}
    //       data-testid="root"
    //     />,
    //   )
    //   expect(getByTestId('root')).toBeEmptyDOMElement()
    //   expect(getByTestId('root')).toHaveAttribute('src', '/foo.jpg')
    // })

    it('content of nested children', () => {
      const { getByTestId } = render(
        <Media component="picture" data-testid="root">
          <img src="foo.jpg" alt="" data-testid="img" />
        </Media>,
      )
      expect(getByTestId('img')).toBeInTheDocument()
    })
  })
})
