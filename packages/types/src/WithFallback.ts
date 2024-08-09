/**
 * Use `TValue` if truthy, otherwise use `TFallback`.
 *
 * @example
 * ```tsx
 * type Example1 = WithFallback<null, 'fallback'> // 'fallback'
 * type Example2 = WithFallback<{}, 'fallback'> // 'fallback'
 * type Example3 = WithFallback<'value', 'fallback'> // 'value'
 * type Example4 = WithFallback<{ key: 'val' }, 'fallback'> // { key: 'val' }
 * ```
 */
export type WithFallback<TValue, TFallback = never> = keyof TValue extends never
  ? TFallback
  : TValue
