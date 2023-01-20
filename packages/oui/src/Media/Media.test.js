import * as React from 'react'
import { stub } from 'sinon'
import mediaQuery from 'css-mediaquery'
import { createRender, describeConformance, screen } from 'test/utils'
import Media from '.'

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
  const render = createRender()
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
    uiName: 'OuiMedia',
    inheritComponent: 'img',
    refInstanceof: window.HTMLImageElement,
    render,
    testComponentPropWith: 'picture',
    skip: ['themeStyleOverrides'],
  }))

  describe('should render with', () => {
    it('`loading` attribute because default lazy loaded', () => {
      render(<Media src="/foo.jpg" />)
      const img = screen.getByRole('img')

      expect(img).toHaveAttribute('src')
      expect(img).toHaveAttribute('loading')
    })

    it('no `loading` attribute when `priority` is specified', () => {
      render(<Media src="/foo.jpg" priority />)
      const img = screen.getByRole('img')

      expect(img).toHaveAttribute('src')
      expect(img).not.toHaveAttribute('loading')
    })

    it('no `src` attribute when `component="video"` because default lazy loaded', () => {
      render(<Media component="video" src="/foo.mp4" data-testid="root" />)
      const video = screen.getByTestId('root')

      expect(video).not.toHaveAttribute('src')
    })

    it('`src` attribute when `component="video"` and `priority` is specified', () => {
      render(<Media component="video" src="/foo.mp4" priority data-testid="root" />)
      const video = screen.getByTestId('root')

      expect(video).toHaveAttribute('src')
    })

    it('img attributes forwarded to child `img` when `component="picture"` is specified', () => {
      const imgAttributes = {
        alt: 'Hello',
        height: '100',
        width: '100',
        loading: 'lazy',
        srcSet: '/foo-480w.jpg 480w, /foo-800w.jpg 800w',
        sizes: '(max-width: 600px) 480px, 800px',
        src: '/foo-800w.jpg',
      }

      render(<Media component="picture" priority data-testid="root" {...imgAttributes} />)
      const picture = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(picture.tagName).toEqual('PICTURE')
      Object.entries(imgAttributes).forEach(([key, val]) => {
        expect(img).toHaveAttribute(key, val)
      })
    })

    it('one source tag per breakpoint when breakpoint keys are strings and component is `picture`', () => {
      render(
        <Media
          component="picture"
          breakpoints={{
            xs: '/foo.jpg',
            sm: '/foo-big.jpg',
          }}
          priority
          data-testid="root"
        />,
      )
      const picture = screen.getByTestId('root')
      const sources = picture.getElementsByTagName('source')

      expect(sources).toHaveLength(2)
      expect(sources[0]).toHaveAttribute('srcset', '/foo-big.jpg')
      expect(sources[1]).toHaveAttribute('srcset', '/foo.jpg')
    })

    it('one source tag per breakpoint with spreaded props when breakpoint keys are objects and component is `picture`', () => {
      render(
        <Media
          component="picture"
          breakpoints={{
            xs: { src: '/foo.webp', type: 'image/webp', width: 1600, height: 900 },
            sm: { src: '/bar.webp', type: 'image/webp', width: 1600, height: 900 },
          }}
          data-testid="root"
        />,
      )
      const picture = screen.getByTestId('root')
      const sources = picture.getElementsByTagName('source')

      expect(sources).toHaveLength(2)
      expect(sources[0]).toHaveAttribute('type', 'image/webp')
      expect(sources[0]).toHaveAttribute('width', '1600')
      expect(sources[0]).toHaveAttribute('height', '900')
      expect(sources[1]).toHaveAttribute('type', 'image/webp')
      expect(sources[1]).toHaveAttribute('width', '1600')
      expect(sources[1]).toHaveAttribute('height', '900')
    })

    it('single element when `breakpoints` is specified & component is not `picture`', () => {
      render(
        <Media
          component="video"
          breakpoints={{
            xs: '/foo.mp4',
          }}
          priority
          data-testid="root"
        />,
      )
      const video = screen.getByTestId('root')

      expect(video).toBeEmptyDOMElement()
      expect(video).toHaveAttribute('src', '/foo.mp4')
    })

    it('spreadable props on a per breakpoint basis when component is not `picture`', () => {
      render(
        <Media
          breakpoints={{
            xs: {
              component: 'video',
              poster: '/foo.jpg',
              src: '/foo.mp4',
            },
          }}
          priority
          data-testid="root"
        />,
      )
      const video = screen.getByTestId('root')

      expect(video).toBeEmptyDOMElement()
      expect(video).toHaveAttribute('poster', '/foo.jpg')
      expect(video).toHaveAttribute('src', '/foo.mp4')
    })

    it('content of nested children', () => {
      render(
        <Media component="picture" data-testid="root">
          <img src="/foo.jpg" alt="" />
        </Media>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(root).toContainElement(img)
      expect(img).toHaveAttribute('src', '/foo.jpg')
    })
  })

  describe('`generatePreload` callback arguemnts are set correctly when', () => {
    it('`component="img"` with `src`', () => {
      const component = 'img'
      const src = '/foo.jpg'

      let preloads
      render(
        <Media
          component={component}
          src={src}
          generatePreload={(args) => {
            preloads = args
          }}
          priority
        />,
      )

      expect(preloads.component).toEqual(component)
      expect(preloads.sources).toBe(undefined)
      expect(preloads.src).toEqual(src)
    })

    it('`component="picture"` with `breakpoints`', () => {
      const component = 'picture'
      const breakpoints = {
        xs: '/foo-xs.jpg',
        md: '/foo-md.jpg',
        xl: '/foo-xl.jpg',
      }

      let preloads
      render(
        <Media
          component={component}
          breakpoints={breakpoints}
          generatePreload={(args) => {
            preloads = args
          }}
          priority
        />,
      )

      const breakpointValues = Object.values(breakpoints)
      expect(preloads.component).toEqual(component)
      expect(preloads.sources.length).toBe(breakpointValues.length)
      breakpointValues.reverse().forEach((val, idx) => {
        expect(preloads.sources[idx].media).toEqual(expect.stringContaining('(min-width:'))
        expect(preloads.sources[idx].src).toEqual(val)
      })
      expect(preloads.src).toBe(undefined)
    })

    it('`component="video"` with `src`', () => {
      const component = 'video'
      const src = '/foo.mp4'

      let preloads
      render(
        <Media
          component={component}
          src={src}
          generatePreload={(args) => {
            preloads = args
          }}
          priority
        />,
      )

      expect(preloads.component).toEqual(component)
      expect(preloads.sources).toBe(undefined)
      expect(preloads.src).toEqual(src)
    })
  })
})
