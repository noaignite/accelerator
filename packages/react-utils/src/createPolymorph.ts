import type { DistributiveOmit, Overwrite } from '@noaignite/types'
import { assert } from '@noaignite/utils'
import type { ComponentPropsWithRef, ElementType, ReactElement, ReactPortal } from 'react'
import { version } from 'react'

/** Returns `keyof T` if it exists, otherwise fallback to `D` */
type PickOrDefault<T, K extends PropertyKey, D> = K extends keyof T ? Pick<T, K> : D

/**
 * Return `true` if `K` exists in `O`, otherwise `false`.
 * Similar in use to `in` operator in JavaScript
 */
type KeyIn<K extends PropertyKey, O extends Record<PropertyKey, unknown>> = O extends object
  ? K extends keyof O
    ? true
    : false
  : false

/**
 * Enforce strict object shape of `T` by requiring only properties of `U` to be
 * present in `T` and none other. Useful in generics, where TypeScript loosely
 * matches object shapes.
 */
type Exact<T, U extends T> = T & Record<Exclude<keyof U, keyof T>, never>

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Promote user-defined types
type Props = Record<string, any>

/** Derived props of element `T` */
type PropsOf<T extends ElementType> = ComponentPropsWithRef<T>

type Config<P extends Props, T extends ElementType> = {
  /**
   * An object which specifies which native attributes, derived from `T`, should
   * be overwritten (provided that they exist).
   *
   * These are applied after native attributes of `T` and before user-provided
   * props `P`. Meaning that user-provided props will always take precedence.
   */
  overrides?: { [K in keyof PropsOf<T>]?: unknown }
  /**
   * An object which specifies which props should be omitted from the resulting
   * polymorphic component (provided that they exist).
   *
   * These are applied last, after native attributes of `T` and user-provided
   * props of `P`. Meaning that omitted props will always be removed.
   */
  omit?: keyof P | keyof PropsOf<T>
}

/** Derived `as` prop from `P` if it matches `ElementType`. */
type AsOf<P extends Props> = 'as' extends keyof P
  ? P['as'] extends ElementType
    ? P['as']
    : ElementType
  : ElementType

/** Return `P` if `as` exists in `P`, otherwise `unknown`  */
type IfValidAs<P extends Props> = P extends { as?: ElementType } ? P : unknown

/** Composes an object of all `C['overrides']` keys which exist in `PropsOf<T>` */
type ComposeOverrides<T extends ElementType, C extends Config<Props, T>> =
  KeyIn<'overrides', C> extends true
    ? Pick<C['overrides'], Extract<keyof C['overrides'], keyof PropsOf<T>>>
    : object

/**
 * Return type of `PolymorphicExoticComponent`.
 * Functionally similar to `ReactNode`, but with additional restrictions.
 */
export type PolymorphicElement<P extends Props, T extends ElementType> =
  | ReactElement<P, T>
  | ReactPortal
  | null
  | undefined

/**
 * Derives the entire set of props for a polymorphic component, combining
 * user-provided props `P`, with derived native props of element `T` whilst
 * attaching `"as"` and `"ref"` props to provide polymorphism support.
 */
export type PolymorphicProps<
  P extends Props,
  T extends ElementType,
  C extends Exact<Config<P, T>, C> = object,
> = DistributiveOmit<
  Overwrite<Overwrite<PropsOf<T>, ComposeOverrides<T, C>>, P>,
  'as' | 'ref' | (KeyIn<'omit', C> extends true ? C['omit'] : '')
> &
  PickOrDefault<P & IfValidAs<P>, 'as', { as?: T }> &
  PickOrDefault<P & IfValidAs<P>, 'ref', { ref?: PropsOf<T>['ref'] }>

/**
 * Render function of `createPolymorph`.
 *
 * Enriches polymorph development typings, allowing default native props to be
 * derived by the initial `as` prop (type `T`). This will not affect the
 * consumer-facing API, only the component implementation.
 */
export type PolymorphicRenderFunction<
  P extends Props,
  T extends ElementType = AsOf<P>,
  C extends Exact<Config<P, T>, C> = object,
> = (props: PolymorphicProps<P, T, C>) => PolymorphicElement<P, T>

/**
 * Return type of `createPolymorph`.
 *
 * Enriches polymorph consumer typings, allowing changes to `as` redefine the
 * `ElementType` and its native attributes. These changes will not affect types
 * within component implementation; only the consumer-facing API.
 */
export type PolymorphicExoticComponent<
  P extends Props,
  T extends ElementType = AsOf<P>,
  C extends Exact<Config<P, T>, C> = object,
> = <TT = AsOf<P> extends ElementType ? P['as'] : T>(
  props: PolymorphicProps<P, TT extends ElementType ? TT : T, C>,
) => PolymorphicElement<P, TT extends ElementType ? TT : T>

/**
 * Creates a polymorphic component.
 * This combines user-provided props `P` with derived native props of element `T`.
 *
 * Exposes `as` prop to allow root element, and its native attribute types, to
 * be changed. Changing the `as` prop will also change the `ref` type. Accepts
 * any native `Element` tag name ('div', 'input', 'button'), or a custom React
 * component.
 *
 * Optionally accepts a config `C` type to fine-tune the attributes exposed
 * to consumers and their types.
 * - `overrides` allows modification of derived native props.
 * - `omit` allows removal of props from the resulting polymorphic component.
 *
 * @param render - Render function of `PolymorphicExoticComponent`.
 *
 * @returns `PolymorphicExoticComponent`
 *
 * @example
 * ```tsx
 * type ButtonProps = { variant: 'success' | 'error' }

 * type ButtonConfig = {
 *   // Remove 'reset' prop from type 'button'
 *   overrides: { type: 'button' | 'submit' },
 *   // Disallow custom `children`
 *   omit: 'children'
 * }
 *
 * const Button = createPolymorph<
 *   ButtonProps,
 *   'button',
 *   ButtonConfig
 * >(({ as: Tag = 'button', type, variant, ...rest }) => {
 *   return (
 *     <Tag {...rest}>
 *       {variant === 'success' ? 'Yaay!' : 'Oh dear...'}
 *     </Tag>
 *   )
 * })
 * ```
 */
export const createPolymorph = <
  P extends Props,
  T extends ElementType,
  C extends Exact<Config<P, T>, C> = object,
>(
  render: PolymorphicRenderFunction<P, T, C>,
) => {
  assert(
    (Number(version.split('.')[0]) || 0) >= 19,
    'To use `createPolymorph`, please upgrade "react" and "@types/react" to version 19 or higher.',
  )

  return render as PolymorphicExoticComponent<P, T, C>
}
