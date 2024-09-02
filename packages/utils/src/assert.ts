/**
 * Assert state which your program assumes to be true.
 *
 * @param condition - The condition which should be true.
 * @param message - The message to throw if the condition is false.
 * @throws Error If the condition is false.
 *
 * @example
 * ```ts
 * assert(foo !== undefined, 'foo should not be undefined')
 * assert(typeof bar !== 'string', 'bar should not be of type string')
 * ```
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
