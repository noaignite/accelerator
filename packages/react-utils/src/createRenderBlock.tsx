/* eslint-disable tsdoc/syntax -- Allow dot-notated @param's, seems to work. */
/* eslint-disable @typescript-eslint/no-explicit-any -- To any or not to any, that is the question. */

import { Fragment, type ComponentProps, type ComponentType, type ReactNode } from 'react'

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
 * @param options.wrapper - An optional function for wrapping the rendered
 * block component.
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
 *   wrapper: ({ children }, context) => (
 *     <section data-render-index={context.renderIndex}>{children}</section>
 *   ),
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
export interface RenderBlockTypeMap {
  blockType: string
  props: Record<PropertyKey, unknown>
}

/**
 * Adapter function used to transform block data before it is passed to the
 * registered block component.
 *
 * @typeParam TInProps - Props received by the adapter. These are usually the
 * incoming block props after renderer-injected props and configured default
 * props have been merged in.
 * @typeParam TOutProps - Final props returned from the adapter and passed to
 * the block component. Adapters may omit or override renderer-injected props.
 * @typeParam TContext - Context object provided to `renderBlock`.
 * @typeParam TGlobals - Shared globals configured on `createRenderBlock`.
 */
export type RenderBlockAdapter<
  TInProps extends Record<PropertyKey, unknown>,
  TOutProps extends Record<PropertyKey, unknown>,
  TContext extends Record<PropertyKey, unknown>,
  TGlobals extends Record<PropertyKey, unknown>,
> = (props: TInProps, context: TContext, globals: TGlobals) => Promise<TOutProps> | TOutProps

/**
 * Props injected by `renderBlock` for every rendered block.
 *
 * These values are included in adapter input and wrapper props. Adapters are
 * responsible for the final component props, so adapter output may omit or
 * override these values before the component is rendered.
 *
 * @typeParam TBlockType - Literal block type for the selected block component.
 */
export type RenderBlockInjectedProps<TBlockType extends string = string> = {
  blockType: TBlockType
  renderIndex: number
}

/**
 * Wrapper function used to decorate the rendered block element.
 *
 * The wrapper receives renderer-injected block metadata plus `children`, along
 * with the same context and globals available to adapters.
 *
 * @typeParam TBlockType - Literal block type for the rendered block.
 * @typeParam TContext - Context object provided to `renderBlock`.
 * @typeParam TGlobals - Shared globals configured on `createRenderBlock`.
 */
export type RenderBlockWrapper<
  TBlockType extends string,
  TContext extends Record<PropertyKey, unknown>,
  TGlobals extends Record<PropertyKey, unknown>,
> = (
  props: RenderBlockInjectedProps<TBlockType> & {
    children: ReactNode
  },
  context: TContext,
  globals: TGlobals,
) => ReactNode

/**
 * A wrapper around `createRenderBlock` to give the posibility to define the
 * `TContext` interface. This is currently a workaround as there is currently
 * no way in typescript to partially provide generics while having the rest
 * self-infer.
 *
 * @see https://github.com/microsoft/TypeScript/issues/10571
 * @see https://github.com/microsoft/TypeScript/pull/26349
 */
export function _createRenderBlock<
  TContext extends { renderIndex: number; [key: string]: unknown },
>() {
  return function __createRenderBlock<
    TBlocks extends Record<string, ComponentType<any>>,
    TGlobals extends Record<PropertyKey, unknown>,
    TAdapters extends
      | {
          [K in keyof TBlocks]?: RenderBlockAdapter<
            any,
            ComponentProps<TBlocks[K]>,
            TContext,
            TGlobals
          >
        }
      | undefined,
    TDefaultProps extends
      | {
          [K in keyof TBlocks]?: Partial<ComponentProps<TBlocks[K]>>
        }
      | undefined,
  >(
    blocks: TBlocks,
    options: {
      adapters?: TAdapters
      defaultProps?: TDefaultProps
      globals?: TGlobals
      wrapper?: RenderBlockWrapper<keyof TBlocks & string, TContext, TGlobals>
    } = {},
  ) {
    const { adapters, defaultProps, wrapper } = options
    const globals = options.globals ?? ({} as TGlobals)

    /**
     * `renderBlock` is a function which renders a block based on the `blockType`.
     * See `createRenderBlock` for documentation.
     */
    return async function renderBlock<TBlockType extends keyof TBlocks & string>(
      data: {
        blockType: TBlockType
        props: keyof TAdapters extends never
          ? Omit<ComponentProps<TBlocks[TBlockType]>, keyof RenderBlockInjectedProps>
          : any
      },
      renderIndexOrContext: number | TContext,
    ) {
      const { blockType, props } = data
      const context = (
        typeof renderIndexOrContext === 'number'
          ? { renderIndex: renderIndexOrContext }
          : renderIndexOrContext
      ) as TContext

      if (typeof blockType !== 'string') {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            'renderBlock: Block with renderIndex `%s` is missing the property `blockType`.',
            context.renderIndex,
          )
        }
        return null
      }

      if (!(blockType in blocks)) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            'renderBlock: Block with renderIndex `%s` and blockType `%s` could not find a matching component.',
            context.renderIndex,
            blockType,
          )
        }
        return null
      }

      type BlockProps = ComponentProps<TBlocks[TBlockType]>
      const Component = blocks[blockType] as ComponentType<BlockProps>
      const componentDefaultProps = defaultProps?.[blockType]

      const injectedProps: RenderBlockInjectedProps<TBlockType> = {
        blockType,
        renderIndex: context.renderIndex,
      }

      let componentProps = {
        ...componentDefaultProps,
        ...props,
        ...injectedProps,
      } as BlockProps

      if (adapters) {
        const adapter = adapters[blockType]
        if (typeof adapter === 'function') {
          componentProps = await adapter(componentProps, context, globals)
        }
      }

      const children = <Component {...componentProps} />
      const block = wrapper ? wrapper({ ...injectedProps, children }, context, globals) : children

      return <Fragment key={context.renderIndex}>{block}</Fragment>
    }
  }
}
