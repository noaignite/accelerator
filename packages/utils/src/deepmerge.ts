import { isPlainObject } from './isPlainObject'

export interface DeepmergeOptions {
  /**
   * Decides whether the objects will be deeply cloned or modified during the
   * merge.
   */
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
 * The `deepmerge` function recursively merges two objects, combining their
 * properties and deeply merging nested objects. It can optionally clone
 * objects during the merge to avoid mutating the original input. This is
 * useful when merging configuration objects, state trees, or any deeply
 * nested structures.
 *
 * @param target - The target object that will receive properties from the
 * source object.
 * @param source - The source object from which properties will be copied and
 * merged into the target.
 * @param options - {@link DeepmergeOptions} An optional options object.
 * @returns The merged object, which is a combination of properties from both
 * the target and source objects.
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
        // Since `output` is a clone of `target` and we have narrowed `target`
        // in this block we can cast to the same type.
        ;(output as Record<PropertyKey, unknown>)[key] = deepmerge(
          target[key],
          source[key],
          options,
        )
      } else if (options.clone) {
        ;(output as Record<PropertyKey, unknown>)[key] = isPlainObject(source[key])
          ? deepClone(source[key])
          : source[key]
      } else {
        ;(output as Record<PropertyKey, unknown>)[key] = source[key]
      }
    })
  }

  return output
}
