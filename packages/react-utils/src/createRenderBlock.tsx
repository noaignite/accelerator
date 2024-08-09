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
 * @param blocks - A Record of components which will be used to render based on
 * the `blockType` property by the data provided to `renderBlock`.
 * @param options - An optional configuration object for the renderer.
 * @param options.adapters - A Record of adapters with keys matching that of
 * `blocks`. Useful for enriching data provided to the block component. For
 * example, adding a Next.js Link component for routing or simply fetching data
 * from another API. Each adapter will receive data forwarded by `renderBlock`,
 * as long as the adapter name matches it's corresponding block name. The data
 * returned by an adapter must match the interface of it's corresponding block
 * component.
 * @param options.fallback - An optional component to render instead of the
 * block in case of an error occurring.
 * @returns `renderBlock` function
 *
 * @example
 * ```tsx
 * export const heroAdapter = async (props: HeroData['props']): Promise<HeroProps> => {
 *   const data = (await fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
 *     return res.json()
 *   })) as { title: string }
 *
 *   return {
 *     ...props,
 *     title: `${props.title} ${data.title}`,
 *     CtaComponent: Link,
 *   }
 * }
 *
 * const blocks = { Hero: HeroComponent }
 *
 * const options = {
 *  adapters: { Hero: heroAdapter },
 *  fallback: FallbackComponent,
 * }
 *
 * const renderBlock = createRenderBlock(blocks, options)
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
 * A wrapper around `createRenderBlock` to give the posibility to define the
 * `TAdditionalData` type. This is currently a workaround as there is
 * currently no way in typescript to partially provide generics while having
 * the rest infer.
 *
 * @see https://github.com/microsoft/TypeScript/issues/10571
 * @see https://github.com/microsoft/TypeScript/pull/26349
 */
export function _createRenderBlock<
  TAdditionalData extends number | { index: number;[key: string]: unknown },
>() {
  return function __createRenderBlock<
    TBlocks extends Record<string, ComponentType<any>>,
    TAdapters extends
    | {
      [K in keyof TBlocks]?: (
        props: any,
        additionalData: TAdditionalData,
      ) => Promise<PropsFrom<TBlocks[K]>> | PropsFrom<TBlocks[K]>
    }
    | undefined,
  >(
    blocks: TBlocks,
    options: {
      adapters?: TAdapters
      fallback?: ErrorBoundaryProps['fallback']
    } = {},
  ) {
    const { adapters, fallback } = options

    /**
     * `renderBlock` is a function which renders a block based on the `blockType`.
     * See `createRenderBlock` for documentation.
     */
    return async function renderBlock<TBlockType extends keyof TBlocks>(
      data: {
        blockType: TBlockType
        props: keyof TAdapters extends never ? PropsFrom<TBlocks[TBlockType]> : any
      },
      indexOrAdditionalData: TAdditionalData,
    ) {
      const { blockType, props } = data
      const { index } =
        typeof indexOrAdditionalData === 'number'
          ? { index: indexOrAdditionalData }
          : indexOrAdditionalData

      if (typeof blockType !== 'string') {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            'renderBlock: Block with index `%s` is missing the property `blockType`.',
            index,
          )
        }
        return null
      }

      if (!(blockType in blocks)) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            'renderBlock: Block with index `%s` and blockType `%s` could not find a matching component.',
            index,
            blockType,
          )
        }
        return null
      }

      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style -- TS not infering correctly so we assert.
      const Component = blocks[blockType] as ComponentType<any>
      let componentProps = props

      if (adapters) {
        const adapter = adapters[blockType]
        if (typeof adapter === 'function') {
          componentProps = await adapter(props, indexOrAdditionalData)
        }
      }

      return (
        <ErrorBoundary blockType={blockType} fallback={fallback} key={index}>
          <Suspense fallback={null}>
            <Component renderIndex={index} {...componentProps} />
          </Suspense>
        </ErrorBoundary>
      )
    }
  }
}
