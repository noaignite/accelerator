import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CacheAsideOptions, cacheAside } from './cacheAside'

describe('EntriesClient', () => {
  type ClientCacheEntry = { id: string; name: string }

  /**
   * Creates a mocked `EntriesClientCache`.
   *
   */
  function createMockedCacheClient() {
    const cache = new Map<string, string>()

    return {
      clear: () => {
        cache.clear()
      },
      get: vi.fn(async (ids: string[]) => {
        try {
          const entries = ids.map((id) => {
            const entry = cache.get(id)
            if (!entry) return undefined
            return JSON.parse(entry) as ClientCacheEntry
          })

          return Promise.resolve(entries.filter(Boolean) as ClientCacheEntry[])
        } catch (e) {
          return []
        }
      }),
      set: vi.fn(async (entries: ClientCacheEntry[]) => {
        entries.forEach((product) => {
          cache.set(product.id, JSON.stringify(product))
        })

        return Promise.resolve()
      }),
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when cache entry is available', async () => {
    // Arrange
    const mockedKvClient = createMockedCacheClient()
    const onMiss = vi.fn((_ids: string[]) => Promise.resolve([]))

    const entryId = '123'

    // Inserting a cache entry
    await mockedKvClient.set([{ id: entryId, name: 'foo' }])

    const options: CacheAsideOptions<
      string[],
      Awaited<ReturnType<(typeof mockedKvClient)['get']>>
    > = {
      cache: mockedKvClient,
      isHit: (id, entries) => Boolean(entries.find((entry) => entry.id === id)),
      onMiss,
    }

    it('should only pass ids that resulted in a cache miss', async () => {
      await cacheAside([entryId], options)

      expect(options.onMiss).toHaveBeenCalledTimes(0)

      await cacheAside([entryId, '1'], options)

      expect(onMiss).toHaveBeenLastCalledWith(['1'])
    })

    it('returns a product with price and inventory', async () => {
      // Act
      const entries = await cacheAside([entryId], options)

      // Assert
      expect(entries).toEqual([{ id: entryId, name: 'foo' }])
      expect(onMiss).toHaveBeenCalledTimes(0)
      expect(mockedKvClient.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('when cache entry is unavailable', () => {
    // Arrange
    const mockedKvClient = createMockedCacheClient()

    const externalServiceCallback = vi.fn((ids: string[]) =>
      Promise.resolve(ids.map((id) => ({ id, name: 'foo' }))),
    )

    const productId = '123'

    // Passing in a cache client with no entries.
    const options: CacheAsideOptions<
      string[],
      Awaited<ReturnType<typeof externalServiceCallback>>
    > = {
      cache: mockedKvClient,
      onMiss: externalServiceCallback,
      isHit: (id, entries) => Boolean(entries.find((entry) => entry.id === id)),
    }

    afterEach(() => {
      // Clearing the cache after each test.
      mockedKvClient.clear()
    })

    it('retrieves price and inventory from the externalServiceCallback', async () => {
      // Act
      const entries = await cacheAside([productId], options)

      // Assert
      const results = [{ id: productId, name: 'foo' }]
      expect(entries).toEqual(results)
      expect(externalServiceCallback).toHaveBeenCalledTimes(1)
      expect(externalServiceCallback).toHaveResolvedWith(results)
      expect(mockedKvClient.get).toHaveBeenCalledTimes(1)
    })

    it('inserts price and inventory in cache upon retrieval from externalServiceCallback', async () => {
      // Act
      const entries = await cacheAside([productId], options)

      // Assert
      const results = [{ id: productId, name: 'foo' }]
      expect(entries).toEqual(results)
      expect(externalServiceCallback).toHaveBeenCalledTimes(1)
      expect(mockedKvClient.get).toHaveBeenCalledTimes(1)
      expect(mockedKvClient.set).toHaveBeenCalledTimes(1)
      // @ts-expect-error -- This is fine.
      await expect(mockedKvClient.get([results[0].id])).resolves.toEqual(results)
    })

    it('returns an empty array on no matches from externalServiceCallback', async () => {
      // Arrange
      externalServiceCallback.mockImplementation((_: string[]) => {
        return Promise.resolve([])
      })

      // Act
      const entries = await cacheAside([productId], options)

      // Assert
      expect(entries).toEqual([])
      expect(externalServiceCallback).toHaveBeenCalledTimes(1)
      expect(mockedKvClient.get).toHaveBeenCalledTimes(1)
      expect(mockedKvClient.set).toHaveBeenCalledTimes(0)
    })
  })
})
