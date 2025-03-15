'use client'

import { Component, type ErrorInfo, type JSX, type ReactNode } from 'react'

/**
 * Props passed to the fallback component or function when an error is caught by the `ErrorBoundary`.
 */
export type ErrorBoundaryFallbackProps = {
  /**
   * Identifies the type of block or component that threw the error.
   */
  blockType?: string
  /**
   * A callback function to reset the error boundary state. Once called, the boundary
   * will attempt to re-render the children, assuming the error condition has been resolved.
   */
  resetErrorBoundary?: () => void
}

/**
 * Props for the `ErrorBoundary` component.
 */
export type ErrorBoundaryProps = {
  /**
   * Identifies the type of block or component that might throw an error.
   */
  blockType: string
  /**
   * Child components or elements that the boundary should wrap and monitor for errors.
   */
  children: ReactNode
  /**
   * Fallback content to display when an error is caught.
   */
  fallback?:
    | ((props: ErrorBoundaryFallbackProps) => JSX.Element | null)
    | JSX.Element
    | string
    | null
}

/**
 * Internal state for the `ErrorBoundary` component, indicating whether an error has occurred.
 */
export type ErrorBoundaryState = {
  /**
   * Whether an error has been caught by the boundary.
   */
  hasError: boolean
}

/**
 * A React error boundary component that catches JavaScript errors in its child components,
 * logs those errors, and displays a fallback UI (if provided).
 *
 * @remarks
 *
 * The boundary’s fallback can be a React element, a string, or a function that accepts
 * {@link ErrorBoundaryFallbackProps} for more dynamic rendering. It also provides a
 * `resetErrorBoundary` function to clear the error state and attempt to render the children
 * again.
 *
 * @example
 * ```tsx
 * function Fallback({ resetErrorBoundary }: ErrorBoundaryFallbackProps) {
 *   return (
 *     <div>
 *       <p>Something went wrong!</p>
 *       <button onClick={resetErrorBoundary}>Try again</button>
 *     </div>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <ErrorBoundary blockType="App" fallback={Fallback}>
 *       <MyMainComponent />
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here.
    console.error({ error, errorInfo })
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false })
  }

  render() {
    // Check if the error is thrown.
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          blockType: this.props.blockType,
          resetErrorBoundary: this.resetErrorBoundary,
        })
      }

      return this.props.fallback
    }

    // Return children components in case of no error
    return this.props.children
  }
}
