/**
 * Sleep for a given number of milliseconds
 *
 * @param ms - number of milliseconds to sleep
 * @returns a promise that resolves after the given number of milliseconds
 *
 * @example
 * ```ts
 * await sleep(1000)
 * ```
 */
export default function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
