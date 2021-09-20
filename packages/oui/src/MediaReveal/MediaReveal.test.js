import * as React from 'react'
import { createRender, describeConformance, getClasses } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import MediaReveal from './MediaReveal'

describe('<MediaReveal />', () => {
  const render = createRender({ wrapper: TestProvider })
  let classes

  const defaultProps = {
    children: <div />,
  }

  beforeEach(() => {
    classes = getClasses(<MediaReveal {...defaultProps} />, render)
  })

  describeConformance(<MediaReveal {...defaultProps} />, () => ({
    classes,
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    skip: [
      // https://github.com/facebook/react/issues/11565
      'reactTestRenderer',
    ],
  }))

  it('should render with content of nested children', () => {
    const { getByTestId } = render(
      <MediaReveal data-testid="root">
        <img src="foo.jpg" alt="" data-testid="child" />
      </MediaReveal>,
    )
    expect(getByTestId('root')).not.toHaveAttribute('style')
    expect(getByTestId('child')).toBeInTheDocument()
  })

  describe('should apply the ratio class and inline style of `--aspect-ratio`', () => {
    it('if `width` & `height` are specified', () => {
      const { getByTestId } = render(
        <MediaReveal width={2} height={1} data-testid="root" {...defaultProps} />,
      )
      expect(getByTestId('root')).toHaveClass(classes.ratio)
      expect(getByTestId('root')).toHaveStyle('--aspect-ratio: 2')
    })

    it('if `ratio` is specified', () => {
      const { getByTestId } = render(<MediaReveal ratio={2} data-testid="root" {...defaultProps} />)
      expect(getByTestId('root')).toHaveClass(classes.ratio)
      expect(getByTestId('root')).toHaveStyle('--aspect-ratio: 2')
    })
  })

  it('should apply the ratio class but no inline styles if `ratio` is specified as a boolean', () => {
    const { getByTestId } = render(<MediaReveal ratio data-testid="root" {...defaultProps} />)
    expect(getByTestId('root')).toHaveClass(classes.ratio)
    expect(getByTestId('root')).not.toHaveAttribute('style')
  })
})
