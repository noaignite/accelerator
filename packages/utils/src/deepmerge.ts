import { isPlainObject } from './isPlainObject'

export interface DeepmergeOptions {
  clone?: boolean
}

function deepClone<T>(source: T): T | Record<PropertyKey, unknown> {
  if (!isPlainObject(source)) {
    return source
  }

  const output: Record<PropertyKey, unknown> = {}

  Object.keys(source).forEach((key) => {
    output[key] = deepClone(source[key])
  })

  return output
}

/**
 * Deep merge two objects.
 *
 * @param target - The target object
 * @param source - The source object
 * @param options - The merge options
 * @returns The merged object
 *
 * @example
 * ```ts
 * deepmerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 * ```
 */
export function deepmerge<T>(
  target: T,
  source: unknown,
  options: DeepmergeOptions = { clone: true },
): T {
  const output = options.clone ? { ...target } : target

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      if (
        isPlainObject(source[key]) &&
        // Avoid prototype pollution
        Object.prototype.hasOwnProperty.call(target, key) &&
        isPlainObject(target[key])
      ) {
        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
        ; (output as Record<PropertyKey, unknown>)[key] = deepmerge(
          target[key],
          source[key],
          options,
        )
      } else if (options.clone) {
        ; (output as Record<PropertyKey, unknown>)[key] = isPlainObject(source[key])
          ? deepClone(source[key])
          : source[key]
      } else {
        ; (output as Record<PropertyKey, unknown>)[key] = source[key]
      }
    })
  }

  return output
}
