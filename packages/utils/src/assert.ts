/**
 * Checks if a `condition` is `true`. If the `condition` is `false`, it throws an error
 * with a specified message. This function is useful for enforcing runtime invariants
 * and `condition`s that must hold. It also uses the TypeScript `asserts` keyword to
 * inform the type checker that the `condition` is always `true` after the assertion.
 *
 * @param condition - The condition which should be `true`.
 * @param message - The message to throw if the condition is `false`.
 * @param errorType - The type of error to throw if the condition is `false`.
 * @throws Error If the condition is `false`.
 *
 * @example
 * ```ts
 * assert(foo !== undefined, 'foo should not be undefined')
 * assert(typeof bar !== 'string', 'bar should not be of type string')
 * assert(baz.length > 0', 'baz should have a length greater than 0', RangeError)
 * ```
 */
export function assert(
  condition: unknown,
  message: string,
  errorType?: ErrorConstructor,
): asserts condition {
  if (!condition) {
    throw new (errorType ?? Error)(message)
  }
}
