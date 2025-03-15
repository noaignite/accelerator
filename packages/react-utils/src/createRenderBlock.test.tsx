/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for test files */
import '@testing-library/jest-dom' // for toBeInTheDocument, etc.
import { render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { BlockAdapter } from './createRenderBlock'
import { createRenderBlock } from './createRenderBlock'

// -- Example Components -------------------------------------------------------

// A simple component that displays props for testing.
function MockComponent(props: { blockType?: string; renderIndex?: number; [k: string]: unknown }) {
  const { blockType, renderIndex, ...rest } = props
  return (
    <div data-testid="mock-component">
      blockType: {blockType}, renderIndex: {renderIndex}, props: {JSON.stringify(rest)}
    </div>
  )
}

// A component that deliberately throws an error to test error boundary fallback.
function BrokenComponent() {
  throw new Error('Broken block')
}

// -- Example Adapters --------------------------------------------------------

// An adapter that appends a prop called `adapterApplied`.
const heroAdapter: BlockAdapter<
  { title: string },
  { title: string; adapterApplied: boolean },
  any,
  any
> = (props) => {
  return { ...props, adapterApplied: true }
}

// -- Tests -------------------------------------------------------------------

describe('createRenderBlock', () => {
  // Suppress error logging from the ErrorBoundary in test output.
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should render a block when given a known blockType', async () => {
    // Create a blocks object with one known component.
    const blocks = {
      Hero: MockComponent,
    }

    // Create the renderBlock function.
    const renderBlock = createRenderBlock(blocks)

    // Call renderBlock to get the React element, then render it.
    render(await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, 0))

    // Verify that the component is rendered with correct props.
    const mockComponent = screen.getByTestId('mock-component')
    expect(mockComponent).toHaveTextContent('blockType: Hero')
    expect(mockComponent).toHaveTextContent('renderIndex: 0')
    expect(mockComponent).toHaveTextContent('"title":"Hello"')
  })

  it('should apply defaultProps before normal props', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    // Provide defaultProps for the Hero block.
    const defaultProps = {
      Hero: { color: 'brand1', size: 'large' },
    }

    const renderBlock = createRenderBlock(blocks, { defaultProps })

    // Overwrite `size`, keep `color`, and add a new prop `title`.
    render(await renderBlock({ blockType: 'Hero', props: { size: 'small', title: 'Hello' } }, 1))

    // color should remain 'brand1' from defaults, size should be overridden to 'small', and title should be added.
    const mockComponent = screen.getByTestId('mock-component')
    expect(mockComponent).toHaveTextContent('"color":"brand1"')
    expect(mockComponent).toHaveTextContent('"size":"small"')
    expect(mockComponent).toHaveTextContent('"title":"Hello"')
  })

  it('should run an adapter if provided', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    // Provide an adapter for Hero that adds `adapterApplied`.
    const adapters = {
      Hero: heroAdapter,
    }

    const renderBlock = createRenderBlock(blocks, { adapters })

    // Render the block; the adapter modifies props.
    render(await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, 2))

    // Check if the adapter was applied.
    const mockComponent = screen.getByTestId('mock-component')
    expect(mockComponent).toHaveTextContent('"adapterApplied":true')
  })

  it('should log an error and returns null if blockType is missing from blocks', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    const renderBlock = createRenderBlock(blocks)
    // @ts-expect-error - We want to specifically test for this error
    const result = await renderBlock({ blockType: 'MissingBlock', props: {} }, 3)

    // result should be null, so there's nothing to render.
    expect(result).toBeNull()

    // Make sure the error was logged.
    expect(console.error).toHaveBeenCalledWith(
      'renderBlock: Block with index `%s` and blockType `%s` could not find a matching component.',
      3,
      'MissingBlock',
    )
  })

  it('should display the fallback if the component throws an error', async () => {
    const blocks = {
      Hero: MockComponent,
      Broken: BrokenComponent,
    }

    // Provide a fallback component for the error boundary.
    const fallback = <div data-testid="fallback">Something went wrong!</div>

    // @ts-expect-error - We want to specifically test for this error
    const renderBlock = createRenderBlock(blocks, { fallback })

    // Render the broken block. It should throw an error and show the fallback.
    render(await renderBlock({ blockType: 'Broken', props: {} }, 4))

    // Wait for the fallback to appear in the DOM.
    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument()
    })
  })

  it('should apply globals in the adapter', async () => {
    const blocks = {
      Message: MockComponent,
    }

    // Define globals with a property 'suffix'.
    const globals = { suffix: '!!!' }

    // Create an adapter that uses the global value to modify the message prop.
    const globalsAdapter: BlockAdapter<
      { message: string },
      { message: string },
      any,
      { suffix: string }
    > = (props, _context, globalsArg) => {
      return { ...props, message: props.message + globalsArg.suffix }
    }

    const adapters = { Message: globalsAdapter }

    // Create the renderBlock function with adapters and globals provided.
    const renderBlock = createRenderBlock(blocks, { adapters, globals })

    // Render the block passing a message prop.
    const element = await renderBlock({ blockType: 'Message', props: { message: 'Hello' } }, 6)
    render(element)

    // Verify that the adapter appended the global suffix to the message.
    const mockComponent = screen.getByTestId('mock-component')
    expect(mockComponent).toHaveTextContent('"message":"Hello!!!"')
  })
})
