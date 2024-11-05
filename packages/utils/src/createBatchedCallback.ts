/* eslint-disable tsdoc/syntax -- Allow documentation of object params */

type Options<T> = {
  callback: (args: T[]) => void
  wait: number
  limit?: number | ((queue: T[]) => boolean)
}

/**
 * Creates a batched debounce function that accumulates arguments over a defined
 * period and invokes a callback once certain conditions are met.
 *
 * This function is useful for scenarios where you want to gather multiple
 * calls over a period of time (batching) and process them all at once, either
 * when a specified `wait` period is reached, or based on a custom flush condition.
 *
 * @param options - An object containing the configuration options.
 * @param options.callback - The function to be called with the batched
 * arguments when the flush condition is met.
 * @param options.limit - A number specifying the maximum batch size or a
 * predicate function that determines if the batch should be flushed.
 * @param options.wait - The number of milliseconds to wait before automatically
 * flushing the batch if the condition isn't met.
 * @returns A function that accepts an argument of type T, adds it to the batch,
 * and flushes the batch based on the limit or wait time.
 *
 * @example
 * ```ts
 * // Using a numeric limit:
 * const batchedApiCall = createBatchedCallback({
 *   callback: (requests) => pushViewItemListEvent(requests),
 *   wait: 200,
 *   limit: 5,
 * );
 *
 * // Using a function as limit:
 * const batchedApiCall = createBatchedCallback({
 *   callback: (requests) => pushViewItemListEvent(requests),
 *   wait: 200,
 *   limit: (argsQueue) => argsQueue.length >= 5,
 * );
 *
 * // Batch & debounce the calls
 * batchedApiCall({ url: "/api/data/1" });
 * batchedApiCall({ url: "/api/data/2" });
 * ```
 */
export function createBatchedCallback<T>(options: Options<T>) {
  const { callback, limit, wait } = options

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let argsQueue: T[] = []

  return (arg: T) => {
    argsQueue.push(arg)

    let condition = false
    if (typeof limit === 'number') {
      condition = argsQueue.length >= limit
    } else if (typeof limit === 'function') {
      condition = limit(argsQueue)
    }

    if (condition) {
      callback(argsQueue)
      argsQueue = []
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = null
      return
    }

    // Set a new timeout to process the queue after the specified wait time
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        callback(argsQueue)
        argsQueue = []
        timeoutId = null
      }, wait)
    }
  }
}
