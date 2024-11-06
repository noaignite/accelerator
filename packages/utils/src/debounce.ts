import type { AnyFunction } from '@noaignite/types'

interface Cancelable {
  clear: () => void
}

/**
 * Returns a debounced version of the given function, delaying its execution
 * until after `wait` milliseconds have passed since the last call.
 *
 * @param callback - The function to debounce.
 * @param wait - Delay in milliseconds before `callback` is invoked; default is
 * 166 ms. 166 corresponds to 10 frames at 60 Hz.
 * @returns The debounced function, with a `clear` method to cancel any
 * pending execution.
 *
 * @example
 * ```ts
 * const debouncedLog = debounce((msg: string) => console.log(msg), 200);
 * debouncedLog("Hello"); // Executes function after 200 ms
 * debouncedLog.clear(); // Cancels pending execution
 * ```
 */
export function debounce<T extends AnyFunction>(callback: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  function debounced(...args: Parameters<T>) {
    const later = () => {
      // @ts-expect-error -- Bind the context, no need to type it.
      callback.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  debounced.clear = () => {
    clearTimeout(timeout)
  }

  return debounced as T & Cancelable
}
