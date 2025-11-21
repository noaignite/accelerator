import { assert } from '@noaignite/utils'
import type { ComponentPropsWithRef, ElementType, ReactElement, ReactPortal } from 'react'
import { version } from 'react'

// Keep props structural without introducing an `any` index signature that would widen fields
type Props = object

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
  overrides?: Partial<PropsOf<T>>
  /**
   * An object which specifies which props should be omitted from the resulting
   * polymorphic component (provided that they exist).
   *
   * These are applied last, after native attributes of `T` and user-provided
   * props of `P`. Meaning that omitted props will always be removed.
   */
  omit?: keyof P | keyof PropsOf<T>
}

type OverridesFor<T extends ElementType, C> = C extends { overrides: infer O }
  ? O extends object
    ? Pick<O, Extract<keyof O, keyof PropsOf<T>>>
    : object
  : object

type OmittedKeys<C> = C extends { omit: infer O } ? (O extends PropertyKey ? O : never) : never

type NativeProps<T extends ElementType, C> =
  OverridesFor<T, C> extends infer O
    ? O extends object
      ? Omit<PropsOf<T>, keyof O> & O
      : PropsOf<T>
    : PropsOf<T>

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
  C extends Config<P, T> = Config<P, T>,
> = Omit<NativeProps<T, C>, 'as' | 'ref' | OmittedKeys<C>> &
  Omit<P, OmittedKeys<C>> & {
    as?: T
    ref?: PropsOf<T>['ref']
  }

/**
 * Render function of `createPolymorph`.
 *
 * Enriches polymorph development typings, allowing default native props to be
 * derived by the initial `as` prop (type `T`). This will not affect the
 * consumer-facing API, only the component implementation.
 */
export type PolymorphicRenderFunction<
  P extends Props,
  T extends ElementType,
  C extends Config<P, T> = Config<P, T>,
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
  T extends ElementType,
  C extends Config<P, T> = Config<P, T>,
> = <TT extends ElementType = T>(props: PolymorphicProps<P, TT, C>) => PolymorphicElement<P, TT>

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
  C extends Config<P, T> = Config<P, T>,
>(
  render: PolymorphicRenderFunction<P, T, C>,
) => {
  assert(
    (Number(version.split('.')[0]) || 0) >= 19,
    'To use `createPolymorph`, please upgrade "react" and "@types/react" to version 19 or higher.',
  )

  return render as PolymorphicExoticComponent<P, T, C>
}
