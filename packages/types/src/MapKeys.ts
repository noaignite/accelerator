/**
 * Map keys of an object to another object.
 *
 * @example
 * ```tsx
 * MapKeys<{
 *   oldFoo: string;
 *   oldBar: number;
 * }, {
 *   bar: 'oldBar';
 *   foo: 'oldFoo';
 * }> // { foo: string; bar: number }
 * ```
 */
export type MapKeys<
  T extends Record<PropertyKey, any>,
  U extends Record<PropertyKey, PropertyKey>,
> = {
  [K in keyof U]: U[K] extends keyof T ? T[U[K]] : never
}
