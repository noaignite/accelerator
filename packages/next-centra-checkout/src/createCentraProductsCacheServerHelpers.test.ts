import type { NextApiRequest, NextApiResponse } from 'next'
import nock from 'nock'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createCentraProductCacheServerHelpers,
  nextPagesAdapter,
} from './createCentraProductsCacheServerHelpers'

const CHECKOUT_API = 'https://mock-centra-checkout.com/api'

describe('createCentraProductCacheServerHelpers', () => {
  const mockedProduct = { product: '1234' }

  const mockedSessionContext = {
    market: '50',
    pricelist: '6',
    language: 'en',
  }

  const map = new Map()

  afterEach(() => {
    map.clear()
    nock.cleanAll()
  })

  const formatProduct = vi.fn((product: { product: string }) => {
    return {
      product: product.product,
    }
  })

  const cache = {
    get: vi.fn(async (sessionContext, ids: string[]) => {
      return Promise.resolve(
        ids
          .map((id) =>
            map.get(
              `${sessionContext.market}:${sessionContext.pricelist}:${sessionContext.language}:${id}`,
            ),
          )
          .filter(Boolean),
      )
    }),
    set: vi.fn((sessionContext, products: { product: string }[]) => {
      return Promise.resolve(
        products.map((product) =>
          map.set(
            `${sessionContext.market}:${sessionContext.pricelist}:${sessionContext.language}:${product.product}`,
            product,
          ),
        ),
      )
    }),
  }

  describe('fetchProducts - signal', () => {
    const serverHelpers = createCentraProductCacheServerHelpers({
      centraCheckout: {
        url: CHECKOUT_API,
        secret: '',
        init: () => ({
          signal: AbortSignal.abort()
        })
      },
      cache,
      formatProduct,
      getSessionContexts: () => {
        return [
          {
            market: '50',
            pricelist: '6',
            language: 'en',
          },
          {
            market: '50',
            pricelist: '2',
            language: 'en',
          },
        ]
      },
    })

    const { fetchProducts } = serverHelpers

    it('respects the passed AbortSignal', async () => {
      const scope = nock(CHECKOUT_API)
        .post('/products')
        .reply(200, { products: [{ product: '2' }] })

      const promise = fetchProducts(mockedSessionContext, ['2', '1'])

      await expect(promise).rejects.toMatchObject({ message: /aborted/i })

      expect(scope.isDone()).toBe(false)
    })
  })

  const serverHelpers = createCentraProductCacheServerHelpers({
    centraCheckout: {
      url: CHECKOUT_API,
      secret: '',
    },
    cache,
    formatProduct,
    getSessionContexts: () => {
      return [
        {
          market: '50',
          pricelist: '6',
          language: 'en',
        },
        {
          market: '50',
          pricelist: '2',
          language: 'en',
        },
      ]
    },
  })

  describe('fetchProducts', () => {
    const { fetchProducts } = serverHelpers

    describe('unknown session context', () => {
      it('performs request to origin on unknown session context', async () => {
        const scope = nock(CHECKOUT_API)
          .post('/products')
          .reply(200, { products: [{ product: '1' }, { product: '2' }] })

        await fetchProducts(
          // Unknown / non-configured session context
          {
            market: '1',
            pricelist: '2',
            language: 'sv',
          },
          ['1', '2'],
        )

        expect(scope.isDone()).toBe(true)
      })

      it('handles unknown responses gracefully', async () => {
        const scope = nock(CHECKOUT_API).post('/products').reply(200, { error: {} }) // unknown response

        const results = await fetchProducts(
          // Unknown / non-configured session context
          {
            market: '1',
            pricelist: '2',
            language: 'sv',
          },
          ['1', '2'],
        )

        expect(results).toMatchObject([])
        expect(scope.isDone()).toBe(true)
      })
    })

    it('retrieves product from cache, if available', async () => {
      // Pre-filling the cache with a product.
      cache.set(mockedSessionContext, [mockedProduct])

      const scope = nock(CHECKOUT_API)
        .post('/products')
        .reply(200, { products: [mockedProduct] })

      await fetchProducts(mockedSessionContext, ['1234'])

      expect(cache.get).toHaveBeenCalledWith(mockedSessionContext, ['1234'])
      expect(scope.isDone()).toBe(false) // Since we don't expect `fetchProducts` to call Centra on cache hit.
    })

    it('returns the products in the same order as request', async () => {
      // Pre-filling the cache with products.
      cache.set(mockedSessionContext, [{ product: '1' }, { product: '2' }])
      const results = await fetchProducts(mockedSessionContext, ['2', '1'])

      expect(results).toMatchObject([{ product: '2' }, { product: '1' }])
    })

    it('calls origin on lack of cached product', async () => {
      // Pre-filling the cache with a product.
      cache.set(mockedSessionContext, [{ product: '1' }])

      const scope = nock(CHECKOUT_API)
        .post('/products')
        .reply(200, { products: [{ product: '2' }] })

      const results = await fetchProducts(mockedSessionContext, ['2', '1'])

      expect(results).toMatchObject([{ product: '2' }, { product: '1' }])
      expect(scope.isDone()).toBe(true)
    })

    it('handles unknown response from origin gracefully', async () => {
      // Pre-filling the cache with a product.
      cache.set(mockedSessionContext, [{ product: '1' }])

      const scope = nock(CHECKOUT_API).post('/products').reply(200, { error: null })

      const results = await fetchProducts(mockedSessionContext, ['2', '1'])

      expect(results).toMatchObject([{ product: '1' }])
      expect(scope.isDone()).toBe(true)
    })
  })

  describe('updateProducts', async () => {
    const { updateProducts } = serverHelpers

    const scope = nock(CHECKOUT_API)
      .post('/products', {
        ...mockedSessionContext,
        pricelist: 'all',
        relatedProducts: true,
        products: [mockedProduct.product],
      })
      .reply(200, {
        products: [
          {
            product: '1234',
            prices: {
              '2': {
                priceAsNumber: 200,
              },
              '6': {
                priceAsnumber: 600,
              },
            },
          },
          {
            product: '2',
          },
        ],
      })

    await updateProducts([mockedProduct.product])

    it('calls the formatProduct callback with the retrieved product', async () => {
      expect(formatProduct).toHaveBeenCalledWith({
        product: '1234',
        priceAsNumber: 200,
      })
    })

    it('avoids using products without matching `pricelist` on `prices` property', () => {
      expect(formatProduct).not.toHaveBeenCalledWith({ product: '2' })
    })

    it('performs a POST /products request to the target Centra Checkout API instance', () => {
      expect(scope.isDone()).toBe(true)
    })
  })
})

describe('nextPagesAdapter', async () => {
  const callback = vi.fn(() => undefined) as unknown as Parameters<typeof nextPagesAdapter>[0]

  describe('assertions', () => {
    it('throws error on lack of segmentName option', () => {
      // @ts-expect-error -- Lacking `segmentName` option in `options` parameter
      expect(() => nextPagesAdapter(callback, {})).toThrowError()
    })

    const nextPagesCallback = nextPagesAdapter(callback, {
      segmentName: 'segments',
    })

    it("throws error on multiple 'ids' search params", async () => {
      // We avoid mocking the entirety of the `NextApiRequest` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
      const req = {
        query: {
          ids: ['1', '2'],
        },
      } as unknown as NextApiRequest

      // We avoid mocking the entirety of the `NextApiResponse` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
      const res = {
        setHeaders: vi.fn(),
        status: vi.fn(() => ({ json: vi.fn() })),
      } as unknown as NextApiResponse

      await expect(nextPagesCallback(req, res)).rejects.toThrowError(
        "search parameter 'ids' should be a string",
      )
    })

    it('throws error on leaf segment', async () => {
      // We avoid mocking the entirety of the `NextApiRequest` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
      const req = {
        query: {
          ids: '1,2,3',
          segments: '123',
        },
      } as unknown as NextApiRequest

      // We avoid mocking the entirety of the `NextApiResponse` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
      const res = {
        setHeaders: vi.fn(),
        status: vi.fn(() => ({ json: vi.fn() })),
      } as unknown as NextApiResponse

      await expect(nextPagesCallback(req, res)).rejects.toThrowError(
        /^The current segment is not of type array. Assure that your route name is.*/,
      )
    })

    it('throws on lacking segment parameter', async () => {
      // We avoid mocking the entirety of the `NextApiRequest` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
      const req = {
        query: {
          ids: '1,2,3',
        },
      } as unknown as NextApiRequest

      // We avoid mocking the entirety of the `NextApiResponse` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
      const res = {
        setHeaders: vi.fn(),
        status: vi.fn(() => ({ json: vi.fn() })),
      } as unknown as NextApiResponse

      await expect(
        nextPagesCallback(
          {
            ...req,
            query: {
              ...req.query,
              segments: [],
            },
          } as unknown as NextApiRequest,
          res,
        ),
      ).rejects.toThrowError("missing segment parameter 'market'")

      await expect(
        nextPagesCallback(
          {
            ...req,
            query: {
              ...req.query,
              segments: ['1', ''],
            },
          } as unknown as NextApiRequest,
          res,
        ),
      ).rejects.toThrowError("missing segment parameter 'pricelist'")

      await expect(
        nextPagesCallback(
          {
            ...req,
            query: {
              ...req.query,
              segments: ['1', '1'],
            },
          } as unknown as NextApiRequest,
          res,
        ),
      ).rejects.toThrowError("missing segment parameter 'language'")
    })
  })

  // We avoid mocking the entirety of the `NextApiRequest` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
  const req = {
    query: {
      ids: '1,2,3',
    },
  } as unknown as NextApiRequest

  // We avoid mocking the entirety of the `NextApiResponse` type, since the typing is considered not as important for this test, since we expect the tests to fail if the mocks to be outdated.
  const res = {
    setHeader: vi.fn(),
    status: vi.fn(() => ({ json: vi.fn() })),
  } as unknown as NextApiResponse

  const key = 'x-foo'
  const value = 'bar'

  const responseHeaders = new Headers({
    [key]: value,
  })

  const nextPagesCallback = nextPagesAdapter(callback, {
    segmentName: 'segments',
    responseHeaders,
  })

  await nextPagesCallback(
    {
      ...req,
      query: {
        ...req.query,
        segments: ['1', '2', '3'],
      },
    } as unknown as NextApiRequest,
    res,
  )

  it('appends responseHeaders', () => {
    expect(res.setHeader).toHaveBeenCalledWith(key, value)
  })
})
