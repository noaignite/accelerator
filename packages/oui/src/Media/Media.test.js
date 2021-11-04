import * as React from 'react'
import { screen } from '@testing-library/react'
import { stub } from 'sinon'
import mediaQuery from 'css-mediaquery'
import { createRender, describeConformance } from 'test/utils'
import TestProvider from '../../test/TestProvider'
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
  const render = createRender({ wrapper: TestProvider })
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
    ouiName: 'OuiMedia',
    inheritComponent: 'img',
    refInstanceof: window.HTMLImageElement,
    render,
    testComponentPropWith: 'picture',
    skip: ['themeStyleOverrides'],
  }))

  describe('should render with', () => {
    it('no initial `src` attribute specified because lazy loaded', () => {
      render(<Media src="/foo.jpg" />)
      const img = screen.getByRole('img')

      expect(img).not.toHaveAttribute('src')
    })

    it('`src` attribute when `priority` is specified', () => {
      render(<Media src="/foo.jpg" priority />)
      const img = screen.getByRole('img')

      expect(img).toHaveAttribute('src', '/foo.jpg')
    })

    it('img attributes on child `img` when `component="picture"` is specified', () => {
      render(
        <Media
          component="picture"
          alt="Hello"
          height="100"
          width="100"
          loading="lazy"
          srcSet="/foo-480w.jpg 480w, /foo-800w.jpg 800w"
          sizes="(max-width: 600px) 480px, 800px"
          src="foo-800w.jpg"
          priority
          data-testid="root"
        />,
      )
      const picture = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(picture.tagName).toEqual('PICTURE')
      expect(img).toHaveAttribute('alt')
      expect(img).toHaveAttribute('height')
      expect(img).toHaveAttribute('loading')
      expect(img).toHaveAttribute('sizes')
      expect(img).toHaveAttribute('src')
      expect(img).toHaveAttribute('srcSet')
      expect(img).toHaveAttribute('width')
    })

    it('no initial `srcset` attribute on source tag specified because lazy loaded', () => {
      render(<Media component="picture" breakpoints={{ xs: '/foo.jpg' }} data-testid="root" />)
      const picture = screen.getByTestId('root')

      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')).toHaveLength(1)
      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')[0]).not.toHaveAttribute('srcset')
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

      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')).toHaveLength(2)
      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')[0]).toHaveAttribute('srcset')
      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')[1]).toHaveAttribute('srcset')
    })

    it('one source tag per breakpoint with spreaded props when breakpoint keys are objects and component is `picture`', () => {
      render(
        <Media
          component="picture"
          breakpoints={{
            xs: { src: '/foo.webp', type: 'image/webp' },
            sm: { src: '/bar.webp', type: 'image/webp' },
          }}
          data-testid="root"
        />,
      )
      const picture = screen.getByTestId('root')

      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')).toHaveLength(2)
      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')[0]).toHaveAttribute('type')
      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')[1]).toHaveAttribute('type')
    })

    it('multiple source tags per breakpoint with spreaded props when breakpoint keys are arrays of objects and component is `picture`', () => {
      render(
        <Media
          component="picture"
          breakpoints={{
            xs: [
              { src: '/foo.webp', type: 'image/webp' },
              { src: '/foo.jpg', type: 'image/jpg' },
            ],
          }}
          data-testid="root"
        />,
      )
      const picture = screen.getByTestId('root')

      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')).toHaveLength(2)
      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')[0]).toHaveAttribute('type')
      // eslint-disable-next-line testing-library/no-node-access
      expect(picture.getElementsByTagName('source')[1]).toHaveAttribute('type')
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
          component="img"
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
        <Media component="picture">
          <img src="/foo.jpg" alt="" />
        </Media>,
      )

      expect(screen.getByRole('img')).toHaveAttribute('src', '/foo.jpg')
    })
  })
})
