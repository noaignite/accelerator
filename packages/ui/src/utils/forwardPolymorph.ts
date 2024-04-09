import type { ForwardPolymorphicComponent } from '@noaignite/types'
import { forwardRef } from 'react'

/**
 * A native `React.ForwardRef` with modified typings, which allows developers
 * to modify the output element via the `as` property.
 *
 * @example
 * ```tsx
 * type Props = {
 *   children: string;
 * }
 *
 * const Component = forwardPolymorph<'span', Props>(
 *   (props, ref) => {
 *     const { as: Tag = 'span', ...rest } = props
 *
 *     return <Tag ref={ref} {...rest} />
 *   }
 * )
 * ```
 */
export const forwardPolymorph = forwardRef as ForwardPolymorphicComponent
