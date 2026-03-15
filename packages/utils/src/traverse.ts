type Traverse<TObj, TKey extends PropertyKey> =
  TObj extends Record<string, unknown>
    ? TKey extends keyof TObj
      ? TObj[TKey] extends Array<infer Item>
        ? Item extends Record<string, unknown>
          ? Traverse<Item, TKey> | Item | TObj
          : Item | TObj
        : TObj
      : TObj
    : TObj

/**
 * Recursively traverses an object tree and yields each visited node.
 *
 * The generator always yields the current `obj` first. If `obj[key]` is an
 * array, each entry is traversed recursively using the same key.
 *
 * @param obj - The object to start traversing from.
 * @param key - The property key that contains child entries to traverse.
 * @returns A generator that yields the current object and all recursively
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
 * const ids = [...traverse(tree, 'children')].map((node) => node.id)
 * // ['root', 'a', 'b', 'c']
 * ```
 */
export function* traverse<TObj extends Record<string, unknown>, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey,
): Generator<Traverse<TObj, TKey>, void> {
  yield obj as Traverse<TObj, TKey>

  if (Array.isArray(obj[key])) {
    for (const entry of obj[key]) {
      yield* traverse(entry, key)
    }
  }
}
