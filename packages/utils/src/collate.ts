import type { DistributiveOmit } from '@noaignite/types'

export type CollateOptions = DistributiveOmit<Intl.CollatorOptions, 'usage'>

/**
 * Sorts a list of strings alphabetically using the given locales and options.
 *
 * @param list - The list of `string` values to sort.
 * @param locales - The locales to use for sorting.
 * @param options - {@link CollateOptions} configurable options.
 *
 * @returns A new list of strings sorted alphabetically.
 *
 * @example
 * ```ts
 * const list = ['B', 'A', 'a', 'Z', 'ø', 'æ', 'ä']
 *
 * collate(list, 'de-DE') // ["a", "A", "ä", "æ", "B", "ø", "Z"]
 * collate(list, 'nb-NO', { caseFirst: 'upper' }) // ["A", "a", "B", "Z", "æ", "ä", "ø"]
 * ```
 */
export const collate = (
  list: string[],
  locales: string | string[] | undefined,
  options?: CollateOptions,
) => list.toSorted((x, y) => Intl.Collator(locales, options).compare(x, y))
