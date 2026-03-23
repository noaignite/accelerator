import type { Traverse } from '@noaignite/types'

/**
 * Recursively traverses an object tree and collects each visited node.
 *
 * The returned array always includes the current `obj` first.
 * If `obj[key]` is an iterable, each entry is traversed recursively using the same key.
 *
 * @param obj - The object to start traversing from.
 * @param key - The property key that contains child entries to traverse.
 * @returns An array containing the current object and all recursively
 * reachable descendants.
 *
 * @example
 * ```ts
 * const tree = {
 *   id: 'root',
 *   children: [
 *     { id: 'a', children: [] },
 *     { id: 'b', children: [{ id: 'c', children: [] }] },
 *   ],
 * }
 *
 * const ids = traverse(tree, 'children').map((node) => node.id)
 * // ['root', 'a', 'b', 'c']
 * ```
 */
export function traverse<TObj extends Record<PropertyKey, unknown>, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey,
): Array<Traverse<TObj, TKey>> {
  const results = [obj] as Array<Traverse<TObj, TKey>>

  if (obj && obj[key] && typeof Object(obj[key])[Symbol.iterator] === 'function') {
    for (const entry of obj[key] as unknown as Iterable<TObj>) {
      results.push(...traverse(entry, key))
    }
  }

  return results
}
