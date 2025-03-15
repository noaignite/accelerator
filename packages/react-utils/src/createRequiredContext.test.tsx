import { render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createRequiredContext } from './createRequiredContext'

// Define a type for our test context.
type FooContextValue = { count: number }
// Create our required context.
const [useFoo, FooProvider, FooConsumer] = createRequiredContext<FooContextValue>('Foo')

// A simple component that uses the hook.
function MockComponent() {
  const { count } = useFoo()
  return <div data-testid="mock-component">{count}</div>
}

describe('createRequiredContext', () => {
  // Suppress error logging during tests.
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should provide context value via the hook when wrapped in the provider', () => {
    render(
      <FooProvider value={{ count: 42 }}>
        <MockComponent />
      </FooProvider>,
    )
    expect(screen.getByTestId('mock-component')).toHaveTextContent('42')
  })

  it('should render context value using the Consumer component', () => {
    render(
      <FooProvider value={{ count: 100 }}>
        <FooConsumer>
          {(contextValue) => <div data-testid="consumer">{contextValue?.count}</div>}
        </FooConsumer>
      </FooProvider>,
    )
    expect(screen.getByTestId('consumer')).toHaveTextContent('100')
  })

  it('should throw an error when the hook is used outside of its provider', () => {
    // We expect an error to be thrown when TestComponent is rendered without FooProvider.
    expect(() => render(<MockComponent />)).toThrowError(
      /The accompanying hook created for `FooContext` may only be used within the React tree of its provider\. please declare the provider at a higher level\./,
    )
  })
})
