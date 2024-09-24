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
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
