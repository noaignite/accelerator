import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

// A simple component that throws when `shouldThrow` is true.
function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('I crashed!')
  }
  return <div data-testid="child">Child content</div>
}

describe('<ErrorBoundary />', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeAll(() => {
    // Suppress error logs expected from the error boundary catching errors
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should render children when no error is thrown', () => {
    render(
      <ErrorBoundary
        blockType="Test"
        fallback={<div data-testid="fallback">Something went wrong</div>}
      >
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument()
  })

  it('should render fallback when an error is thrown', () => {
    render(
      <ErrorBoundary
        blockType="Test"
        fallback={<div data-testid="fallback">Something went wrong</div>}
      >
        <ProblemChild shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.queryByTestId('fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  it('should call the fallback function and reset the error boundary', () => {
    // Define a fallback component as a function that receives resetErrorBoundary
    function FallbackComponent({ resetErrorBoundary }: { resetErrorBoundary?: () => void }) {
      return (
        <button data-testid="reset-button" onClick={resetErrorBoundary} type="button">
          Reset
        </button>
      )
    }

    // Create a wrapper that allows toggling the error condition.
    function Wrapper() {
      const [shouldThrow, setShouldThrow] = useState(true)
      return (
        <>
          <button
            data-testid="toggle-button"
            onClick={() => {
              setShouldThrow(false)
            }}
            type="button"
          >
            Stop Throwing
          </button>

          <ErrorBoundary blockType="Test" fallback={FallbackComponent}>
            <ProblemChild shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </>
      )
    }

    render(<Wrapper />)

    // Initially, ProblemChild throws and the fallback is rendered.
    expect(screen.queryByTestId('reset-button')).toBeInTheDocument()

    // Change state so the child no longer throws.
    fireEvent.click(screen.getByTestId('toggle-button'))
    // Click the reset button provided by the fallback.
    fireEvent.click(screen.getByTestId('reset-button'))

    // After reset, the child should render.
    expect(screen.queryByTestId('child')).toBeInTheDocument()
  })
})
