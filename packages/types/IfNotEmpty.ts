/**
 * Use `T` if it's not empty, otherwise use `K`.
 *
 * @todo Missing example
 */
export type IfNotEmpty<T, K = never> = keyof T extends never ? K : T
