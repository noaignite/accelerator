import type {
  ComponentPropsWithoutRef,
  ElementType,
  Fragment,
  ReactElement,
  ReactPortal,
} from 'react'
import type { Maybe, Overwrite, RefOf } from '.'

// ----- Internal Utilities -----

/**
 * Adjustment to `ref` property on `Fragment` to allow developers to forward the ref
 * on the root element without needing to use conditional logic.
 *
 * @internal
 */
type FragmentRef<TElement extends ElementType> = TElement extends typeof Fragment
  ? { ref?: never }
  : {}

/**
 * Applies signature polymorphism to a component. If the `as` property is provided,
 * the component will render as the provided element type. If the `as` property is
 * not provided, the component will render as the default element type.
 *
 * @internal
 */
type Tag<TActualElement, TInternalElement extends ElementType> = TActualElement extends ElementType
  ? TActualElement
  : TInternalElement

/**
 * A polymorphic component's JSX-equivalent return type.
 * Functionally similar to `ReactElement`.
 */
export type PolymorphicElement<TElement extends ElementType, TProps extends object> =
  | ReactElement<TProps, TElement>
  | ReactPortal
  | null
  | undefined

// ----- Simple Polymorph -----

/**
 * A polymorphic component type definition which adds an `as` property to the
 * component definition.
 *
 * @example
 * ```tsx
 * type Props = {
 *   greeting: string;
 * }
 *
 * const Greeting: PolymorphicComponent<'h1', Props> = (props) => {
 *   const {
 *     as: Tag = 'h1',
 *     greeting,
 *     ...rest
 *   } = props
 *
 *   return <Tag {...rest}>{greeting}</h1>;
 * };
 *
 * const App = () => {
 *   return <Greeting as="h2" greeting="Hello, world!" />
 * };
 * ```
 */
export type PolymorphicComponent<TInternalElement extends ElementType, TProps extends object> = <
  TActualElement = TInternalElement,
>(
  props: Overwrite<
    ComponentPropsWithoutRef<Tag<TActualElement, TInternalElement>> & {
      as?: Tag<TActualElement, TInternalElement>
    },
    TProps
  >,
) => PolymorphicElement<Tag<TActualElement, TInternalElement>, TProps>

// ----- Forward Polymorph -----

/**
 * Forwarded polymorphic component props, accepts defined properties and adds
 * the `as` and `ref` properties.
 *
 * Can be used in conjunction with `PolymorphicElement` to add additional
 * generic properties to a component created with `forwardPolymorphic`.
 *
 * @example
 * ```tsx
 * type Props<T> = {
 *   greeting: T
 * }
 *
 * const Greeting = forwardPolymorphic<'span', Props<string>>(
 *   (props, ref) => {
 *     const { as: Tag = 'span', greeting, ...rest } = props
 *
 *     return (
 *       <Tag ref={ref} {...rest}>
 *         {JSON.stringify(greeting)}
 *       </Tag>
 *     )
 *   }
 * ) as <T, E extends ElementType = 'span'>(
 *   props: ForwardPolymorphicComponentProps<E, ComponentProps<T>>
 * ) => PolymorphicElement<E, ComponentProps<T>>;
 *
 * const App = () => {
 *   return <Greeting as="h2" greeting="Hello, world!" />
 * };
 * ```
 */
export type ForwardPolymorphicComponentProps<
  TElement extends ElementType,
  TProps extends object,
> = Overwrite<ComponentPropsWithoutRef<TElement> & { as?: TElement; ref?: RefOf<TElement> }, TProps>

/**
 * A castable type definition for `React.ForwardRefRenderFunction`, which
 * injects the `as` and `ref` properties into the component's props.
 *
 * Implementors will need to adhere to this type when developing a component..
 */
export type ForwardPolymorphicRenderFunction<
  TElement extends ElementType,
  TProps extends object,
> = (
  props: Overwrite<
    ComponentPropsWithoutRef<TElement> & FragmentRef<TElement> & { as: Maybe<TElement> },
    TProps
  >,
  ref: RefOf<TElement>,
) => PolymorphicElement<TElement, TProps>

/**
 * A castable type definition for `React.ForwardRefExoticComponent`, which
 * injects the `as` and `ref` properties into the component's props.
 *
 * Consumers will need to adhere to this type when rendering a component.
 */
export type ForwardPolymorphicExoticComponent<
  TInternalElement extends ElementType,
  TProps extends object,
> = <TActualElement = TInternalElement>(
  props: Overwrite<
    ComponentPropsWithoutRef<Tag<TActualElement, TInternalElement>> & {
      as?: Tag<TActualElement, TInternalElement>
      ref?: RefOf<Tag<TActualElement, TInternalElement>>
    },
    TProps
  >,
) => PolymorphicElement<Tag<TActualElement, TInternalElement>, TProps>

/**
 * A castable type definition for `React.forwardRef`, which injects the `as` and
 * `ref` properties into the component's props.
 *
 * @example
 * export const forwardPolymorphic = forwardRef as ForwardPolymorphicComponent;
 */
export type ForwardPolymorphicComponent = <TElement extends ElementType, TProps extends object>(
  render: ForwardPolymorphicRenderFunction<TElement, TProps>,
) => ForwardPolymorphicExoticComponent<TElement, TProps>
