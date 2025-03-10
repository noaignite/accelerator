export type CacheClient<TParam, TResults> = {
  /**
   * Get entries by their keys from cache.
   */
  get: (param: TParam) => Promise<TResults>
  /**
   * Insert entries to the cache.
   */
  set: (entries: TResults) => Promise<unknown>
}

export type CacheAsideOptions<TParam, TResults> = {
  /**
   * The cache client. This will be used to get and set cached content.
   */
  cache: CacheClient<TParam, TResults>
  /**
   * The callback to be called when entries is not found in the cache.
   * If the entries not found in `cache` gets returned from `onMiss`, they will be
   * set in the cache and be appended to the result from the cache.
   *
   * @param args - The arguments that resulted in a cache miss.
   */
  onMiss: (param: TParam) => Promise<TResults>
  isHit: <TInnerParam extends TParam extends unknown[] ? TParam[number] : TParam>(
    param: TInnerParam,
    cacheResults: TResults,
  ) => boolean
}

/**
 * Creates a `Cache-Aside` callback.
 * @param param - The parameter to use to retrieve a value from the cache client (or `onMiss` callback).
 * @param options - Configurable options.
 *
 * @see https://www.geeksforgeeks.org/cache-aside-pattern/
 */
export async function cacheAside<
  TParam,
  TResults extends TParam extends unknown[] ? unknown[] : unknown,
>(param: TParam, options: CacheAsideOptions<TParam, TResults>): Promise<TResults> {
  const { cache, isHit, onMiss } = options
  // Get entries by keys from cache
  const cacheResults = await cache.get(param)

  if (!Array.isArray(param) && !isHit(param as Parameters<typeof isHit>[0], cacheResults)) {
    const originResults = await onMiss(param)

    if (originResults) {
      await cache.set(originResults)
    }

    return originResults
  }

  if (Array.isArray(param)) {
    const missedArgs = param.filter((p): p is TParam extends unknown[] ? TParam[number] : never => !isHit(p, cacheResults))

    if (missedArgs.length > 0) {
      // Get entries from origin
      const originResults = (await onMiss(missedArgs as Parameters<typeof onMiss>[0])) as unknown[]

      // Store products in cache
      if (originResults.length > 0) {
        await cache.set(originResults as TResults)
      }

      return [...(cacheResults as unknown[]), ...originResults] as TResults
    }

    return cacheResults
  }

  return cacheResults
}
