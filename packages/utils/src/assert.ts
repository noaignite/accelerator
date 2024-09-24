/**
 * The `assert` function checks if a condition is true. If the condition is
 * false, it throws an error with a specified message. This function is useful
 * for enforcing runtime invariants and conditions that must hold. It also uses
 * the TypeScript `asserts` keyword to inform the type checker that the
 * condition is always true after the assertion.
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
