/* eslint-disable tsdoc/syntax -- Allow dot-notated @param's, seems to work. */
/* eslint-disable @typescript-eslint/no-explicit-any -- To any or not to any, that is the question. */

import type { PropsFrom } from '@noaignite/types'
import { Suspense, type ComponentType } from 'react'
import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary'

/**
 * `createRenderBlock` is a utility function for registering the to-be rendered
 * blocks and corresponding data adapters. Returns the `renderBlock` function
 * which in turn does the actual rendering of the blocks provided it receives
 * data matching the interface of the registered block components.
 *
 * @param blocks - A Record of components which are rendered based on the data
 * provided to `renderBlock`.
 * @param options - An optional configuration object for the renderer.
 * @param options.adapters - A Record of functions with keys matching that of
 * provided `blocks`. Adapters are for transforming or enriching data before
 * it is passed to the block component. An adapter function will run as long as
 * its name matches that of a registered block component.
 * @param options.defaultProps - A Record of objects with keys matching that of
 * provided `blocks`. Default props are applied before any adapter and override
 * block component default props. Useful for when instantiating multiple
 * `renderBlock` functions where the blocks should behave differently.
 * @param options.globals - Globals are meant to be the place where one can
 * register needed utils that all adapters should have access to.
 * @param options.fallback - A UI component to render for when the internal
 * block error boundary catches an error.
 * @returns `renderBlock` function.
 *
 * @example
 * ```tsx
 * const blocks = {
 *   Hero: HeroComponent,
 * }
 *
 * const adapters = {
 *   Hero: async (props: HeroData['props'], context, globals): Promise<HeroProps> => {
 *     const { locale } = context
 *     const { LinkComponent } = globals
 *
 *     const data = (await fetch( `https://domain.com/${locale}/posts/1`).then((res) => {
 *       return res.json()
 *     })) as { title: string }
 *
 *     return {
 *       ...props,
 *       LinkComponent,
 *       title: `${props.title} - ${data.title}`,
 *     }
 *   }
 * }
 *
 * const defaultProps = {
 *   Hero: { color: 'brand1' },
 * }
 *
 * const globals = {
 *   LinkComponent: Link,
 * }
 *
 * const renderBlock = createRenderBlock(blocks, {
 *   adapters,
 *   defaultProps,
 *   globals,
 *   fallback: FallbackComponent,
 * })
 *
 * const blocksData = [{
 *   blockType: 'Hero' as const,
 *   props: { title: 'Hello World!' },
 * }]
 *
 * const blocks = await Promise.all(blocksData.map(renderBlock))
 * ```
 */
export const createRenderBlock = _createRenderBlock()

/**
 * The interface that block data needs to conform to.
 */
export interface BlockTypeMap {
  blockType: string
  props: Record<PropertyKey, unknown>
}

/**
 * Type helper to set up a block adapter.
 */
export type BlockAdapter<
  TInProps extends Record<PropertyKey, unknown>,
  TOutProps extends Record<PropertyKey, unknown>,
  TContext extends Record<PropertyKey, unknown>,
  TGlobals extends Record<PropertyKey, unknown>,
> = (props: TInProps, context: TContext, globals: TGlobals) => Promise<TOutProps> | TOutProps

/**
 * A wrapper around `createRenderBlock` to give the posibility to define the
 * `TContext` interface. This is currently a workaround as there is currently
 * no way in typescript to partially provide generics while having the rest
 * self-infer.
 *
 * @see https://github.com/microsoft/TypeScript/issues/10571
 * @see https://github.com/microsoft/TypeScript/pull/26349
 */
export function _createRenderBlock<TContext extends { index: number; [key: string]: unknown }>() {
  return function __createRenderBlock<
    TBlocks extends Record<PropertyKey, ComponentType<any>>,
    TGlobals extends Record<PropertyKey, unknown>,
    TAdapters extends
      | {
          [K in keyof TBlocks]?: BlockAdapter<any, PropsFrom<TBlocks[K]>, TContext, TGlobals>
        }
      | undefined,
    TDefaultProps extends
      | {
          [K in keyof TBlocks]?: Partial<PropsFrom<TBlocks[K]>>
        }
      | undefined,
  >(
    blocks: TBlocks,
    options: {
      adapters?: TAdapters
      defaultProps?: TDefaultProps
      fallback?: ErrorBoundaryProps['fallback']
      globals?: TGlobals
    } = {},
  ) {
    const { adapters, defaultProps, fallback } = options
    const globals = options.globals ?? ({} as TGlobals)

    /**
     * `renderBlock` is a function which renders a block based on the `blockType`.
     * See `createRenderBlock` for documentation.
     */
    return async function renderBlock<TBlockType extends keyof TBlocks>(
      data: {
        blockType: TBlockType
        props: keyof TAdapters extends never ? PropsFrom<TBlocks[TBlockType]> : any
      },
      indexOrContext: number | TContext,
    ) {
      const { blockType, props } = data
      const context = (
        typeof indexOrContext === 'number' ? { index: indexOrContext } : indexOrContext
      ) as TContext

      if (typeof blockType !== 'string') {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            'renderBlock: Block with index `%s` is missing the property `blockType`.',
            context.index,
          )
        }
        return null
      }

      if (!(blockType in blocks)) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            'renderBlock: Block with index `%s` and blockType `%s` could not find a matching component.',
            context.index,
            blockType,
          )
        }
        return null
      }

      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style -- TS not infering correctly so we assert.
      const Component = blocks[blockType] as ComponentType<any>
      const componentDefaultProps = defaultProps?.[blockType]
      let componentProps = { ...componentDefaultProps, ...props }

      if (adapters) {
        const adapter = adapters[blockType]
        if (typeof adapter === 'function') {
          componentProps = await adapter(componentProps, context, globals)
        }
      }

      return (
        <ErrorBoundary blockType={blockType} fallback={fallback} key={context.index}>
          <Suspense fallback={null}>
            <Component blockType={blockType} renderIndex={context.index} {...componentProps} />
          </Suspense>
        </ErrorBoundary>
      )
    }
  }
}
