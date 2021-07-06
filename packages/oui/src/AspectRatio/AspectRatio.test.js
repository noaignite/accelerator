import * as React from 'react'
import { screen } from '@testing-library/react'
import { createRender, describeConformance, getClasses } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import AspectRatio from './AspectRatio'

describe('<AspectRatio />', () => {
  const render = createRender({ wrapper: TestProvider })
  let classes

  beforeEach(() => {
    classes = getClasses(<AspectRatio />, render)
  })

  describeConformance(<AspectRatio />, () => ({
    classes,
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
  }))

  it('should render with content of nested children', () => {
    render(
      <AspectRatio data-testid="root">
        <img src="foo.jpg" alt="" data-testid="child" />
      </AspectRatio>,
    )
    expect(screen.getByTestId('root')).not.toHaveAttribute('style')
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  describe('should apply the ratio class and inline style of `--aspect-ratio`', () => {
    it('if `width` & `height` are specified', () => {
      render(<AspectRatio width={2} height={1} data-testid="root" />)
      expect(screen.getByTestId('root')).toHaveClass(classes.ratio)
      expect(screen.getByTestId('root')).toHaveStyle('--aspect-ratio: 2')
    })

    it('if `ratio` is specified', () => {
      render(<AspectRatio ratio={2} data-testid="root" />)
      expect(screen.getByTestId('root')).toHaveClass(classes.ratio)
      expect(screen.getByTestId('root')).toHaveStyle('--aspect-ratio: 2')
    })
  })

  it('should apply the ratio class but no inline styles if `ratio` is specified as a boolean', () => {
    render(<AspectRatio ratio data-testid="root" />)
    expect(screen.getByTestId('root')).toHaveClass(classes.ratio)
    expect(screen.getByTestId('root')).not.toHaveAttribute('style')
  })
})
