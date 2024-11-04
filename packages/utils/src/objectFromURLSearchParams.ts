/**
 * Converts a `URLSearchParams` instance into a plain object.
 *
 * This function extracts all keys and their corresponding values from the
 * `URLSearchParams`. If a key has multiple values, they will be stored as an
 * array; if it has a single value, that value will be stored as a string. If
 * a key has no values, it defaults to an empty string.
 *
 * @param searchParams - The `URLSearchParams` instance to convert.
 * @returns An object where keys are parameter names and values are either
 * strings or arrays of strings.
 *
 * @example
 * ```ts
 * const string = 'name=Alice&hobbies=reading&hobbies=hiking'
 * const params = new URLSearchParams(string);
 * const object = objectFromURLSearchParams(params);
 * console.log(object); // { name: 'Alice', hobbies: ['reading', 'hiking'] }
 * ```
 */
export function objectFromURLSearchParams(searchParams: URLSearchParams) {
  const object: Record<string, string | string[]> = {}

  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key)
    object[key] = values.length > 1 ? values : (values[0] ?? '')
  }

  return object
}
