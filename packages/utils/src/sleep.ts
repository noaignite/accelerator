/**
 * The `sleep` function introduces a delay by returning a `Promise` that
 * resolves after a specified number of milliseconds. This is useful for
 * pausing the execution of asynchronous code for a given time, allowing you
 * to simulate delays or wait between operations.
 *
 * @param milliseconds - The number of milliseconds to delay before the
 * `Promise` resolves. If no value is provided, the default is 0, meaning it
 * resolves immediately in the next event loop cycle.
 * @returns A `Promise` that resolves after the specified delay.
 *
 * @example
 * ```ts
 * await sleep(1000) // Resolves after 1 second
 * ```
 */
export function sleep(milliseconds = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}
