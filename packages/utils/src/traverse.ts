import type { Traverse } from '@noaignite/types'

/**
 * Recursively traverses an object tree and yields each visited node.
 *
 * The generator always yields the current `obj` first.
 * If `obj[key]` is an iterable, each entry is traversed recursively using the same key.
 *
 * @param obj - The object to start traversing from.
 * @param key - The property key that contains child entries to traverse.
 * @returns A generator that yields the current object and all recursively
 * reachable descendants.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
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
 * const ids = [...traverse(tree, 'children')].map((node) => node.id)
 * // ['root', 'a', 'b', 'c']
 * ```
 */
export function* traverse<TObj extends Record<PropertyKey, unknown>, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey,
): Generator<Traverse<TObj, TKey>, void> {
  yield obj as Traverse<TObj, TKey>

  if (obj && obj[key] && typeof Object(obj[key])[Symbol.iterator] === 'function') {
    for (const entry of obj[key] as unknown as Iterable<TObj>) {
      yield* traverse(entry, key)
    }
  }
}
