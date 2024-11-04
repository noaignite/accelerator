/**
 * Converts an object into a `URLSearchParams` instance.
 *
 * Each key in the object can map to a string or an array of strings.
 * If an existing `URLSearchParams` instance is provided, it will be modified
 * to remove any existing keys from the object before appending new values.
 *
 * @param object - An object where keys are strings and values are either
 * strings or arrays of strings.
 * @param initialSearchParams - An optional initial value for `URLSearchParams`
 * instance to modify.
 * @returns A new `URLSearchParams` instance with the specified key-value pairs.
 *
 * @example
 * ```ts
 * const object = { name: 'Alicia', hobbies: ['reading', 'dancing'] };
 * const params = URLSearchParamsFromObject(object);
 * console.log(params.toString()); // 'name=Alicia&hobbies=reading&hobbies=dancing'
 * ```
 */
export function URLSearchParamsFromObject(
  object: Record<string, string | string[]>,
  initialSearchParams?: ConstructorParameters<typeof URLSearchParams>[0],
): URLSearchParams {
  const params = new URLSearchParams(initialSearchParams)

  for (const [key, values] of Object.entries(object)) {
    params.delete(key)
    const valueArray = Array.isArray(values) ? values : [values]
    valueArray.forEach((value) => {
      params.append(key, value)
    })
  }

  return params
}
