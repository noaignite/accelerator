/**
 * Recursively collects values reachable through a property key.
 *
 * If `TKey` points to an iterable field (for example `children`), this type
 * includes the current object and every nested item found by repeatedly
 * traversing that same key.
 *
 * @example
 * ```tsx
 * type TreeNode = {
 *   id: string;
 *   children: TreeNode[];
 * };
 *
 * // TreeNode (root and descendants)
 * type NodeInTree = Traverse<TreeNode, 'children'>;
 * ```
 */
export type Traverse<TObj, TKey extends PropertyKey, TSeen = never> = TObj extends TSeen
  ? TObj
  : TObj extends Record<PropertyKey, unknown>
    ? TKey extends keyof TObj
      ? TObj[TKey] extends Iterable<infer Item>
        ? Item extends Record<PropertyKey, unknown>
          ? Traverse<Item, TKey, TSeen | TObj> | TObj
          : Item | TObj
        : TObj
      : TObj
    : TObj
