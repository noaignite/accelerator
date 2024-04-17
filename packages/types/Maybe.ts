/**
 * Add `undefined` onto a `T`-type. Useful for conciseness in type expressions.
 *
 * @example
 * type ProductTitle = string;
 *
 * type ComponentProps = {
 * 	title: Maybe<ProductTitle> // string | undefined
 * }
 */
export type Maybe<T> = T | undefined
