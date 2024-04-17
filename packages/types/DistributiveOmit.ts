/**
 * Remove properties `K` from `T`. Functions similar to `Omit<T, K>` type helper
 * but it is distributive.
 *
 * @see https://www.totaltypescript.com/book/objects/understanding-distributive-omit-and-pick-in-typescript
 *
 * @example
 * type A = { a: string; b: number; c: boolean }
 * type Test = DistributiveOmit<A, 'a' | 'b'> // { c: boolean }
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never
