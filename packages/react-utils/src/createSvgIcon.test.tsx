import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { createSvgIcon } from './createSvgIcon'

// Define a test SVG path.
const testPath = <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />

// Create an icon component with a default viewBox and test id passed via additional props.
// @ts-expect-error -- Allow `data-testid` in test file
const TestIcon = createSvgIcon(testPath, 'Home', '0 0 24 24', { 'data-testid': 'svg-icon' })

describe('createSvgIcon', () => {
  // Basic render: It should render an SVG with the default path and viewBox.
  it('renders an SVG element with the correct viewBox and default path', () => {
    render(<TestIcon />)
    const svg = screen.getByTestId('svg-icon')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    const path = svg.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('d', 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z')
  })

  // Test ARIA attributes: When aria-label is provided, role should be "img" and aria-hidden not set.
  it('should render with aria-label and role when provided', () => {
    render(<TestIcon aria-label="Home Icon" />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('aria-label', 'Home Icon')
    expect(svg).not.toHaveAttribute('aria-hidden')
  })

  // When no aria-label is provided, the SVG should be hidden from assistive technologies.
  it('should set aria-hidden when aria-label is not provided', () => {
    render(<TestIcon />)
    const svg = screen.getByTestId('svg-icon')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
  })

  // Additional props should be forwarded to the SVG element.
  it('should forward additional props to the SVG element', () => {
    render(<TestIcon className="custom-class" data-custom="value" />)
    const svg = screen.getByTestId('svg-icon')
    expect(svg).toHaveClass('custom-class')
    expect(svg).toHaveAttribute('data-custom', 'value')
  })

  // If children are provided, they should override the default path.
  it('should override default children if children is passed', () => {
    render(
      <TestIcon>
        <circle cx="12" cy="12" data-testid="custom-child" r="10" />
      </TestIcon>,
    )
    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
  })

  // Test that ref is forwarded to the SVG element.
  it('should forward ref to the SVG element', () => {
    const ref = createRef<SVGSVGElement>()
    render(<TestIcon ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName.toLowerCase()).toBe('svg')
  })
})
