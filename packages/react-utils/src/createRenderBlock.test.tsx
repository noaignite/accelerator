/* eslint-disable @typescript-eslint/no-explicit-any -- Allow for test files */
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense, type ReactNode } from 'react'
import { afterAll, beforeAll, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import type { RenderBlockAdapter } from './createRenderBlock'
import { _createRenderBlock, createRenderBlock } from './createRenderBlock'

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
function BrokenComponent(): never {
  throw new Error('Broken block')
}

// -- Example Adapters --------------------------------------------------------

// An adapter that appends a prop called `adapterApplied`.
const heroAdapter: RenderBlockAdapter<
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

  it('should let adapters control final component props', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    const adapters = {
      Hero: () => ({ title: 'Adapted' }),
    }

    const renderBlock = createRenderBlock(blocks, { adapters })

    render(await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, 2))

    const mockComponent = screen.getByTestId('mock-component')
    expect(mockComponent).not.toHaveTextContent('blockType: Hero')
    expect(mockComponent).not.toHaveTextContent('renderIndex: 2')
    expect(mockComponent).toHaveTextContent('"title":"Adapted"')
  })

  it('should type blockType and renderIndex as renderer-injected props', () => {
    type HeroProps = { title: string; blockType: 'Hero'; renderIndex: number }

    function Hero(_props: HeroProps) {
      return null
    }

    const blocks = {
      Hero,
    }

    const adapters = {
      Hero: (props: HeroProps) => {
        expectTypeOf(props.blockType).toEqualTypeOf<'Hero'>()
        expectTypeOf(props.renderIndex).toEqualTypeOf<number>()

        return props
      },
    }

    const renderBlockWithoutAdapter = createRenderBlock(blocks)
    const renderBlockWithAdapter = createRenderBlock(blocks, { adapters })

    expectTypeOf(renderBlockWithoutAdapter).toBeFunction()
    expectTypeOf(renderBlockWithAdapter).toBeFunction()
    expectTypeOf<Parameters<typeof renderBlockWithoutAdapter>[0]>().toEqualTypeOf<{
      blockType: 'Hero'
      props: { title: string }
    }>()

    void renderBlockWithoutAdapter({ blockType: 'Hero', props: { title: 'Hello' } }, 2)
    void renderBlockWithAdapter({ blockType: 'Hero', props: { title: 'Hello' } }, 2)
  })

  it('should wrap a block with the configured wrapper', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    const renderBlock = createRenderBlock(blocks, {
      wrapper: ({ children, blockType }, context) => {
        return (
          <section
            data-block-type={blockType}
            data-render-index={context.renderIndex}
            data-testid="wrapper"
          >
            {children}
          </section>
        )
      },
    })

    render(await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, 2))

    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-render-index', '2')
    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-block-type', 'Hero')
    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
  })

  it('should pass injected props, context, and globals to the configured wrapper', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    const context = { renderIndex: 7, locale: 'en' }
    const globals = { suffix: '!' }

    const renderBlock = createRenderBlock(blocks, {
      globals,
      wrapper: ({ children, blockType, renderIndex }, contextArg, globalsArg) => {
        return (
          <section
            data-block-type={blockType}
            data-locale={contextArg.locale}
            data-render-index={renderIndex}
            data-suffix={globalsArg.suffix}
            data-testid="wrapper"
          >
            {children}
          </section>
        )
      },
    })

    render(await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, context))

    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-block-type', 'Hero')
    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-render-index', '7')
    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-locale', 'en')
    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-suffix', '!')
    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
  })

  it('should pass wrapper metadata independently from adapter output', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    const adapters = {
      Hero: () => ({ title: 'Adapted' }),
    }

    const renderBlock = createRenderBlock(blocks, {
      adapters,
      wrapper: ({ children, blockType, renderIndex }) => {
        return (
          <section
            data-block-type={blockType}
            data-render-index={renderIndex}
            data-testid="wrapper"
          >
            {children}
          </section>
        )
      },
    })

    render(await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, 8))

    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-block-type', 'Hero')
    expect(screen.getByTestId('wrapper')).toHaveAttribute('data-render-index', '8')
    expect(screen.getByTestId('mock-component')).not.toHaveTextContent('blockType: Hero')
    expect(screen.getByTestId('mock-component')).not.toHaveTextContent('renderIndex: 8')
    expect(screen.getByTestId('mock-component')).toHaveTextContent('"title":"Adapted"')
  })

  it('should render nothing when the configured wrapper returns null', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    const renderBlock = createRenderBlock(blocks, {
      wrapper: () => null,
    })

    render(await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, 2))

    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument()
  })

  it('should log an error and returns null if blockType is missing in data', async () => {
    const blocks = {
      Hero: MockComponent,
    }

    const renderBlock = createRenderBlock(blocks)
    // @ts-expect-error - We want to specifically test for this error
    const result = await renderBlock({ props: {} }, 3)

    // result should be null, so there's nothing to render.
    expect(result).toBeNull()

    // Make sure the error was logged.
    expect(console.error).toHaveBeenCalledWith(
      'renderBlock: Block with renderIndex `%s` is missing the property `blockType`.',
      3,
    )
  })

  it('should log an error and returns null if blockType is missing from registered blocks', async () => {
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
      'renderBlock: Block with renderIndex `%s` and blockType `%s` could not find a matching component.',
      3,
      'MissingBlock',
    )
  })

  it('should display the fallback if an explicit wrapper catches a component error', async () => {
    const blocks = {
      Hero: MockComponent,
      Broken: BrokenComponent,
    }

    // Provide a fallback component for the error boundary.
    const fallback = <div data-testid="fallback">Something went wrong!</div>

    const renderBlock = createRenderBlock(blocks, {
      wrapper: ({ children }) => {
        return (
          <ErrorBoundary blockType="Block" fallback={fallback}>
            <Suspense fallback={null}>{children}</Suspense>
          </ErrorBoundary>
        )
      },
    })

    // Render the broken block. It should throw an error and show the fallback.
    render(await renderBlock({ blockType: 'Broken', props: {} }, 4))

    // Wait for the fallback to appear in the DOM.
    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument()
    })
  })

  it('should let component errors propagate without a wrapper', async () => {
    const blocks = {
      Broken: BrokenComponent,
    }

    const renderBlock = createRenderBlock(blocks)
    const element = await renderBlock({ blockType: 'Broken', props: {} }, 5)

    expect(() => {
      render(element)
    }).toThrow('Broken block')
  })

  it('should apply globals in the adapter', async () => {
    const blocks = {
      Message: MockComponent,
    }

    // Define globals with a property 'suffix'.
    const globals = { suffix: '!!!' }

    // Create an adapter that uses the global value to modify the message prop.
    const globalsAdapter: RenderBlockAdapter<
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

  it('should type wrapper context and globals', () => {
    type HeroProps = { title: string }
    type ProductProps = { title: string }

    const Hero = (_props: HeroProps) => null
    const Product = (_props: ProductProps) => null

    const blocks = {
      Hero,
      Product,
    }

    const createRenderBlockWithContext = _createRenderBlock<{
      renderIndex: number
      locale: string
    }>()

    createRenderBlockWithContext(blocks, {
      globals: { suffix: '!' },
      wrapper: (block, context, globals) => {
        expectTypeOf(block.blockType).toEqualTypeOf<keyof typeof blocks>()
        expectTypeOf(block.renderIndex).toEqualTypeOf<number>()
        expectTypeOf(block.children).toEqualTypeOf<ReactNode>()
        expectTypeOf(context.renderIndex).toEqualTypeOf<number>()
        expectTypeOf(context.locale).toEqualTypeOf<string>()
        expectTypeOf(globals.suffix).toEqualTypeOf<string>()

        return null
      },
    })
  })
})
