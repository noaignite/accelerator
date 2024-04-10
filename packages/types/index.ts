import {
  Component,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  FC,
  Fragment,
  ReactElement,
  ReactPortal,
} from 'react'

/**
 * Takes an object type and makes the hover overlay more readable.
 * @see https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * Takes a component and extracts its props.
 * @see https://www.totaltypescript.com/tips/write-your-own-propsfrom-helper-to-extract-props-from-any-react-component
 */
export type PropsFrom<TComponent> =
  TComponent extends FC<infer Props>
  ? Props
  : TComponent extends Component<infer Props>
  ? Props
  : never

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 *
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-types/index.d.ts
 */
export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 *
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-types/index.d.ts
 */
export type OverridableStringUnion<T extends string | number, U = {}> = GenerateStringUnion<
  Overwrite<Record<T, true>, U>
>

type GenerateStringUnion<T> = Extract<
  {
    [Key in keyof T]: true extends T[Key] ? Key : never
  }[keyof T],
  string
>

/**
 * Use `T` if it's not empty, otherwise use `K`.
 */
export type IfNotEmpty<T, K = never> = keyof T extends never ? K : T

/**
 * TODO: Add description
 */
export type Maybe<T> = NonNullable<T> | undefined

/**
 * The reference of the passed element.
 */
export type RefOf<T extends ElementType> = ComponentPropsWithRef<T>['ref']

/**
 * Remove properties `K` from `T`.
 * Distributive for union types.
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

/**
 * TODO: Add description
 *
 * @internal
 */
type FragmentRef<T extends ElementType> = T extends typeof Fragment ? { ref?: never } : {}

/**
 * TODO: Add description
 *
 * @internal
 */
type Tag<TComponent, TDefaultComponent extends ElementType> = TComponent extends ElementType
  ? TComponent
  : TDefaultComponent

/**
 * A polymorphic component's JSX-equivalent return type.
 * Functionally similar to `ReactElement`.
 */
export type PolymorphicElement<TComponent extends ElementType, TProps extends object> =
  | ReactElement<TProps, TComponent>
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
export type PolymorphicComponent<TDefaultComponent extends ElementType, TProps extends object> = <
  TComponent = TDefaultComponent,
>(
  props: Overwrite<
    ComponentPropsWithoutRef<Tag<TComponent, TDefaultComponent>> & {
      as?: Tag<TComponent, TDefaultComponent>
    },
    TProps
  >,
) => PolymorphicElement<Tag<TComponent, TDefaultComponent>, TProps>

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
  TComponent extends ElementType,
  TProps extends object,
> = Overwrite<
  ComponentPropsWithoutRef<TComponent> & { as?: TComponent; ref?: RefOf<TComponent> },
  TProps
>

/**
 * A castable type definition for `React.ForwardRefRenderFunction`, which
 * injects the `as` and `ref` properties into the component's props.
 *
 * Implementors will need to adhere to this type when developing a component..
 */
export type ForwardPolymorphicRenderFunction<
  TComponent extends ElementType,
  TProps extends object,
> = (
  props: Overwrite<
    ComponentPropsWithoutRef<TComponent> & FragmentRef<TComponent> & { as: Maybe<TComponent> },
    TProps
  >,
  ref: RefOf<TComponent>,
) => PolymorphicElement<TComponent, TProps>

/**
 * A castable type definition for `React.ForwardRefExoticComponent`, which
 * injects the `as` and `ref` properties into the component's props.
 *
 * Consumers will need to adhere to this type when rendering a component.
 */
export type ForwardPolymorphicExoticComponent<
  TDefaultComponent extends ElementType,
  TProps extends object,
> = <TComponent = TDefaultComponent>(
  props: Overwrite<
    ComponentPropsWithoutRef<Tag<TComponent, TDefaultComponent>> & {
      as?: Tag<TComponent, TDefaultComponent>
      ref?: RefOf<Tag<TComponent, TDefaultComponent>>
    },
    TProps
  >,
) => PolymorphicElement<Tag<TComponent, TDefaultComponent>, TProps>

/**
 * A castable type definition for `React.forwardRef`, which injects the `as` and
 * `ref` properties into the component's props.
 *
 * @example
 * ```tsx
 * export const forwardPolymorphic = forwardRef as ForwardPolymorphicComponent;
 * ```
 */
export type ForwardPolymorphicComponent = <TComponent extends ElementType, TProps extends object>(
  render: ForwardPolymorphicRenderFunction<TComponent, TProps>,
) => ForwardPolymorphicExoticComponent<TComponent, TProps>
