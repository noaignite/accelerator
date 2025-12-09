/**
 * Capitalizes the first letter of a given string.
 *
 * @param value - The string to capitalize.
 * @returns The capitalized string.
 *
 * @example
 * ```ts
 * capitalize('hello world') // 'Hello world'
 * ```
 */
export default function capitalize<T extends string>(value: T) {
  return (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<T>
}
