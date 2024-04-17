import type { ComponentPropsWithRef, ElementType } from 'react'

/**
 * Extract the `ref` type from a given React component.
 *
 * @example
 * const ComponentProps = { greeting: string }
 * const Component = forwardRef<HTMLDivElement, ComponentProps>(({ greeting ) => { ... )
 *
 * type RefType = RefOf<typeof Component>
 * // HTMLDivElement
 */
export type RefOf<T extends ElementType> = ComponentPropsWithRef<T>['ref']
