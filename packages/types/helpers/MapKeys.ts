/**
 * Map keys of an object to another object.
 *
 * @example
 * ```tsx
 * MapKeys<{ oldFoo: string; oldBar: number }, { bar: 'oldBar'; foo: 'oldFoo' }> // { foo: string; bar: number }
 * ```
 */
export type MapKeys<T extends Record<string, any>, U extends Record<string, PropertyKey>> = {
  [K in keyof U]: U[K] extends keyof T ? T[U[K]] : never
}
