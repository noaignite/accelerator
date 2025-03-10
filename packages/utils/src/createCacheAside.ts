export type CacheClient<
  TKey extends string,
  TEntry extends { [K in TKey]: string },
  TArgs extends unknown[],
> = {
  /**
   * Get entries by their keys from cache.
   */
  get: (...args: TArgs) => Promise<TEntry[]>
  /**
   * Get products by their ids from cache.
   */
  set: (entries: TEntry[]) => Promise<unknown>
}

/**
 * Creates a `Cache-Aside` callback.
 * @param cache - The cache client. This will be used to get and set cached content.
 * @param externalServiceCallback - The callback to be called when entries is not found in the
 * cache.
 * If the entries not found in `cache` gets returned from `externalServiceCallback`, they will be
 * set in the cache and be appended to the result of the `cache.get` call.
 *
 * @see https://www.geeksforgeeks.org/cache-aside-pattern/
 */
export function createCacheAside<
  TKey extends string,
  TEntry extends { [K in TKey]: string },
  TArgs extends unknown[],
>(options: {
  /**
   * The cache client. This will be used to get and set cached content.
   */
  cache: CacheClient<TKey, TEntry, TArgs>
  /**
   * The callback to be called when entries is not found in the cache.
   * If the entries not found in `cache` gets returned from `onMiss`, they will be
   * set in the cache and be appended to the result from the cache.
   *
   * @param args - The arguments that resulted in a cache miss.
   */
  onMiss: (...args: TArgs) => Promise<TEntry[]>
  isHit: (arg: TArgs[number], cachedEntries: TEntry[]) => boolean
}): (...args: TArgs) => Promise<TEntry[]> {
  const { cache, isHit, onMiss } = options

  return async (...args) => {
    // Get entries by keys from cache
    const entries = await cache.get(...args)

    const missedArgs = args.filter((arg) => !isHit(arg, entries)) as TArgs

    if (missedArgs.length > 0) {
      // Get entries from external service
      const entriesFromOrigin = await onMiss(...missedArgs)

      // Store products in cache
      if (entriesFromOrigin.length > 0) {
        await cache.set(entriesFromOrigin)
      }

      return [...entries, ...entriesFromOrigin]
    }

    return entries
  }
}
