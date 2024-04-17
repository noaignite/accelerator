import type { Component, FC } from 'react'

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
