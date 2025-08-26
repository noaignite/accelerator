/**
 * Recursively makes all properties of a type optional.
 * Unlike `Partial<T>`, this applies to nested objects as well.
 *
 * @example
 * ```tsx
 * type User = {
 *   id: number;
 *   profile: { name: string; email: string };
 * };
 *
 * // All fields optional, even nested ones:
 * // { id?: number; profile?: { name?: string; email?: string } }
 * type UserDeepPartial = DeepPartial<User>;
 * ```
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
