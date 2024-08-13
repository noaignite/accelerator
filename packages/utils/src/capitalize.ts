/**
 * Capitalize the first letter of a string
 *
 * @param str - The string to capitalize
 * @returns The capitalized string
 *
 * @example
 * ```tsx
 * capitalize('hello') // 'Hello'
 * ```
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
