import * as React from 'react'
import { createRender, describeConformance, screen } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import AspectRatio from '.'

describe('<AspectRatio />', () => {
  const render = createRender({ wrapper: TestProvider })

  describeConformance(<AspectRatio />, () => ({
    uiName: 'OuiAspectRatio',
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
  }))

  it('should render with content of nested children & no aspect ratio styles', () => {
    render(
      <AspectRatio data-testid="root">
        <img src="foo.jpg" alt="" />
      </AspectRatio>,
    )
    const root = screen.getByTestId('root')
    const img = screen.getByRole('img')

    expect(root).toContainElement(img)
    expect(getComputedStyle(root).getPropertyValue('--aspect-ratio')).toBeFalsy()
    expect(getComputedStyle(img).getPropertyValue('position')).toBeFalsy()
  })

  describe('should apply the correct aspect ratio styles', () => {
    it('if `width` & `height` are specified as numbers', () => {
      render(
        <AspectRatio width={4} height={2} data-testid="root">
          <img src="foo.jpg" alt="" />
        </AspectRatio>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(getComputedStyle(root).getPropertyValue('--aspect-ratio')).toEqual('2')
      expect(getComputedStyle(img).getPropertyValue('position')).toEqual('absolute')
    })

    it('if `width` & `height` are specified as strings', () => {
      render(
        <AspectRatio width="4" height="2" data-testid="root">
          <img src="foo.jpg" alt="" />
        </AspectRatio>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(getComputedStyle(root).getPropertyValue('--aspect-ratio')).toEqual('2')
      expect(getComputedStyle(img).getPropertyValue('position')).toEqual('absolute')
    })

    it('if `ratio` is specified as a number', () => {
      render(
        <AspectRatio ratio={2} data-testid="root">
          <img src="foo.jpg" alt="" />
        </AspectRatio>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(getComputedStyle(root).getPropertyValue('--aspect-ratio')).toEqual('2')
      expect(getComputedStyle(img).getPropertyValue('position')).toEqual('absolute')
    })

    it('if `ratio` is specified as a string', () => {
      render(
        <AspectRatio ratio="2" data-testid="root">
          <img src="foo.jpg" alt="" />
        </AspectRatio>,
      )
      const root = screen.getByTestId('root')
      const img = screen.getByRole('img')

      expect(getComputedStyle(root).getPropertyValue('--aspect-ratio')).toEqual('2')
      expect(getComputedStyle(img).getPropertyValue('position')).toEqual('absolute')
    })
  })

  it('if `ratio` is specified as a boolean', () => {
    render(
      <AspectRatio ratio data-testid="root">
        <img src="foo.jpg" alt="" />
      </AspectRatio>,
    )
    const root = screen.getByTestId('root')
    const img = screen.getByRole('img')

    expect(getComputedStyle(root).getPropertyValue('--aspect-ratio')).toBeFalsy()
    expect(getComputedStyle(img).getPropertyValue('position')).toEqual('absolute')
  })
})
