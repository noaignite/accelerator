import * as React from 'react'
import { createRender, screen } from 'test/utils'
import createMediaPreload from './createMediaPreload'

describe('createMediaPreload', () => {
  const render = createRender()

  it('is a function that returns a function', () => {
    const mediaPreload = createMediaPreload()

    expect(typeof createMediaPreload).toEqual('function')
    expect(typeof mediaPreload).toEqual('function')
  })

  describe('mediaPreload', () => {
    const mediaPreload = createMediaPreload(({ children }) => (
      <div data-testid="root">{children}</div>
    ))

    it('should render no children when no props are specified', () => {
      render(mediaPreload())
      const root = screen.getByTestId('root')

      expect(root.children).toHaveLength(0)
    })

    it('should render a single link tag when `component="img"` & `src` is specified', () => {
      const component = 'img'
      const src = '/foo.jpg'

      render(mediaPreload({ component, src }))
      const root = screen.getByTestId('root')
      const links = root.getElementsByTagName('link')

      expect(links).toHaveLength(1)
      expect(links[0]).toHaveAttribute('as', 'image')
      expect(links[0]).toHaveAttribute('rel', 'preload')
      expect(links[0]).toHaveAttribute('href', src)
      expect(links[0]).not.toHaveAttribute('media')
    })

    it('should render a single link tag when `component="audio"` & `src` is specified', () => {
      const component = 'audio'
      const src = '/foo.mp3'

      render(mediaPreload({ component, src }))
      const root = screen.getByTestId('root')
      const links = root.getElementsByTagName('link')

      expect(links).toHaveLength(1)
      expect(links[0]).toHaveAttribute('as', component)
      expect(links[0]).toHaveAttribute('rel', 'preload')
      expect(links[0]).toHaveAttribute('href', src)
      expect(links[0]).not.toHaveAttribute('media')
    })

    it('should render a single link tag when `component="video"` & `src` is specified', () => {
      const component = 'video'
      const src = '/foo.mp4'

      render(mediaPreload({ component, src }))
      const root = screen.getByTestId('root')
      const links = root.getElementsByTagName('link')

      expect(links).toHaveLength(1)
      expect(links[0]).toHaveAttribute('as', component)
      expect(links[0]).toHaveAttribute('rel', 'preload')
      expect(links[0]).toHaveAttribute('href', src)
      expect(links[0]).not.toHaveAttribute('media')
    })

    it('should render multiple link tags when `sources` is specified', () => {
      const component = 'picture'
      const sources = [
        { src: '/foo-400w.jpg', media: '(min-width: 400px)' },
        { src: '/foo-800w.jpg', media: '(min-width: 800px)' },
      ]

      render(mediaPreload({ component, sources }))
      const root = screen.getByTestId('root')
      const links = root.getElementsByTagName('link')

      expect(links).toHaveLength(sources.length)
      sources.forEach((source, idx) => {
        expect(links[idx]).toHaveAttribute('as', 'image')
        expect(links[idx]).toHaveAttribute('rel', 'preload')
        expect(links[idx]).toHaveAttribute('href', source.src)
        expect(links[idx]).toHaveAttribute('media', source.media)
      })
    })
  })
})
