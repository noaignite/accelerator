import * as React from 'react'
import { createRender, describeConformance, screen } from 'test/utils'
import TestProvider from '../../test/TestProvider'
import MediaReveal, { mediaRevealClasses as classes } from '.'

describe('<MediaReveal />', () => {
  const render = createRender({ wrapper: TestProvider })

  const defaultProps = {
    children: <img src="/foo.jpg" data-testid="img" alt="" />,
  }

  describeConformance(<MediaReveal {...defaultProps} />, () => ({
    uiName: 'OuiMediaReveal',
    inheritComponent: 'div',
    refInstanceof: window.HTMLDivElement,
    render,
    testComponentPropWith: 'span',
    testDeepOverrides: { slotName: 'bounds', slotClassName: classes.bounds },
    skip: [
      // https://github.com/facebook/react/issues/11565
      'reactTestRenderer',
      'themeStyleOverrides',
    ],
  }))

  it('should render with a non visible nested `img`', () => {
    render(<MediaReveal data-testid="root" {...defaultProps} />)
    const root = screen.getByTestId('root')
    const img = screen.getByTestId('img')

    expect(root).not.toContainHTML(classes.bounds)
    expect(root).toContainElement(img)
    expect(img).not.toBeVisible()
  })

  it('should render with a visible nested `img`', () => {
    render(<MediaReveal TransitionProps={{ in: true }} data-testid="root" {...defaultProps} />)
    const root = screen.getByTestId('root')
    const img = screen.getByTestId('img')

    expect(root).not.toContainHTML(classes.bounds)
    expect(root).toContainElement(img)
    expect(img).toBeVisible()
  })

  it('should render with nested `bounds` element', () => {
    render(<MediaReveal rootMargin="100px" data-testid="root" {...defaultProps} />)
    const root = screen.getByTestId('root')

    expect(root).toContainHTML(classes.bounds)
  })
})
