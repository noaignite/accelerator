import * as React from 'react'
import { stub } from 'sinon'
import mediaQuery from 'css-mediaquery'
import { createRender, describeConformance, fireEvent, screen } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import ImageZoom, { imageZoomClasses as classes } from '.'

function createMatchMedia(hover, ref) {
  return (query) => {
    const listeners = []
    const instance = {
      matches: mediaQuery.match(query, {
        hover,
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

describe('<ImageZoom />', () => {
  const render = createRender({ wrapper: TestProvider })

  const defaultProps = {
    children: [
      <img key="0" src="/foo-small.jpg" data-testid="preview" alt="" />,
      <img key="1" src="/foo-big.jpg" data-testid="details" alt="" />,
    ],
  }

  describe('with window.matchMedia(hover: none)', () => {
    let matchMediaInstances

    beforeEach(() => {
      matchMediaInstances = []
      const fakeMatchMedia = createMatchMedia('none', matchMediaInstances)
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

    describeConformance(<ImageZoom {...defaultProps} />, () => ({
      uiName: 'OuiImageZoom',
      inheritComponent: 'div',
      refInstanceof: window.HTMLDivElement,
      render,
      testComponentPropWith: 'span',
      skip: [
        // https://github.com/facebook/react/issues/11565
        'reactTestRenderer',
      ],
    }))

    it('should only render a single preview `img` element', async () => {
      render(<ImageZoom data-testid="root" {...defaultProps} />)
      const root = screen.getByTestId('root')
      const preview = screen.getByTestId('preview')

      expect(root).toContainElement(preview)
      expect(root).not.toContainHTML(classes.details)

      fireEvent.mouseEnter(root)

      expect(root).not.toContainHTML(classes.details)
    })
  })

  describe('with window.matchMedia(hover: hover)', () => {
    let matchMediaInstances

    beforeEach(() => {
      matchMediaInstances = []
      const fakeMatchMedia = createMatchMedia('hover', matchMediaInstances)
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

    it('should render secondary `img` element after mouseenter', () => {
      render(<ImageZoom data-testid="root" {...defaultProps} />)
      const root = screen.getByTestId('root')
      const preview = screen.getByTestId('preview')

      expect(root).toContainElement(preview)
      expect(root).not.toContainHTML(classes.details)

      fireEvent.mouseEnter(root)

      expect(root).toContainHTML(classes.details)
    })
  })
})
