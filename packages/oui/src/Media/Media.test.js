import * as React from 'react'
import { stub } from 'sinon'
import mediaQuery from 'css-mediaquery'
import { describeConformance, render } from 'test/utils'
import Media from './Media'

function createMatchMedia(width, ref) {
  return (query) => {
    const listeners = []
    const instance = {
      matches: mediaQuery.match(query, {
        width,
      }),
      addListener: (listener) => {
        listeners.push(listener)
      },
      removeListener: (listener) => {
        const index = listeners.indexOf(listener)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      },
    }
    ref.push({
      instance,
      listeners,
    })
    return instance
  }
}

describe('<Media />', () => {
  let matchMediaInstances

  beforeEach(() => {
    matchMediaInstances = []
    const fakeMatchMedia = createMatchMedia(1200, matchMediaInstances)
    // can't stub non-existent properties with sinon
    // jsdom does not implement window.matchMedia
    if (window.matchMedia === undefined) {
      window.matchMedia = fakeMatchMedia
      window.matchMedia.restore = () => {
        delete window.matchMedia
      }
    } else {
      stub(window, 'matchMedia').callsFake(fakeMatchMedia)
    }
  })

  afterEach(() => {
    window.matchMedia.restore()
  })

  describeConformance(<Media />, () => ({
    inheritComponent: 'img',
    refInstanceof: window.HTMLImageElement,
    render,
    testComponentPropWith: 'picture',
    skip: ['rootClass'],
  }))

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
      expect(getByTestId('root').getElementsByTagName('source').length).toEqual(1)
      expect(getByTestId('root').getElementsByTagName('img').length).toEqual(1)
    })

    it('source formats & img content when `component="picture"` & `breakpoints` is specified', () => {
      const { getByTestId } = render(
        <Media
          component="picture"
          breakpoints={{
            xs: [{ src: '/foo.webp', type: 'image/webp' }, { src: '/foo.jpg' }],
          }}
          data-testid="root"
        />,
      )
      expect(getByTestId('root')).not.toBeEmptyDOMElement()
      expect(getByTestId('root').getElementsByTagName('source').length).toEqual(2)
      expect(getByTestId('root').getElementsByTagName('img').length).toEqual(1)
    })

    it('no children & `src` attribute on root element when component is not `picture`', () => {
      const { getByTestId } = render(
        <Media
          component="video"
          breakpoints={{
            xs: '/foo.mp4',
          }}
          data-testid="root"
        />,
      )
      expect(getByTestId('root')).toBeEmptyDOMElement()
      expect(getByTestId('root')).toHaveAttribute('src', '/foo.mp4')
    })

    it('no children & attributes spread on root element when component is not `picture`', () => {
      const { getByTestId } = render(
        <Media
          component="img"
          breakpoints={{
            xs: {
              component: 'video',
              poster: '/foo.jpg',
              src: '/foo.mp4',
            },
          }}
          data-testid="root"
        />,
      )
      expect(getByTestId('root')).toBeEmptyDOMElement()
      expect(getByTestId('root').tagName).toEqual('VIDEO')
      expect(getByTestId('root')).toHaveAttribute('poster', '/foo.jpg')
      expect(getByTestId('root')).toHaveAttribute('src', '/foo.mp4')
    })

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
