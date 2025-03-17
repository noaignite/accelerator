import { type ProductsResponse } from '@noaignite/centra-types'
import { assert, cacheAside } from '@noaignite/utils'
import { type NextApiRequest, type NextApiResponse } from 'next/types'

export type CentraCheckoutCredentials = {
  /**
   * The Centra Checkout API URL.
   * To be used to get products from the Checkout API.
   */
  url: string
  /**
   * The Centra Checkout API Secret.
   * To be used to get products from the Checkout API.
   */
  secret: string
}

export type ServerHelperOptions<TProduct extends ProductBase> = {
  centraCheckout: CentraCheckoutCredentials
  /**
   * A cache client.
   * Used to get and set products.
   */
  cache: {
    /**
     * get products from the cache.
     *
     * @param sessionContext - The session context used to retrieve the products.
     * @param ids - The ids of the products to retrieve.
     */
    get: (sessionContext: SessionContext, ids: string[]) => Promise<TProduct[]>
    /**
     * Upsert products in the cache.
     *
     * @param sessionContext - The session context of the passed products.
     * @param products - The products to insert to the cache.
     */
    set: (sessionContext: SessionContext, products: TProduct[]) => Promise<unknown>
  }
  /**
   * Format product to the expected shape to be stored in cache.
   * Could be useful to lower bandwidth / cost, both to cache and hosting provider.
   * Will be used both in API endpoint on non-cached products, as well when updating products in cache.
   *
   * @param product - The product retrieved from Centra.
   */
  formatProduct: <TInProduct>(product: TInProduct) => TProduct
  /**
   * Get all the expected session contexts that user may have while browsing the site.
   * Used to update the exposed product representations on webhook calls.
   */
  getSessionContexts: () => SessionContext[] | Promise<SessionContext[]>
}

export type SessionContext = {
  market: string
  pricelist: string
  language: string
}

export type ProductBase = {
  product: string
}

export type RequestAdapterBase<TProduct extends ProductBase> = (
  createFetchProductsEndpoint: (
    sessionContext: SessionContext,
    ids: string[],
  ) => Promise<TProduct[]>,
) => unknown

const fetchProductsCentra = async <
  TProduct extends ProductBase = ProductBase,
  TCentraProductsResponse extends ProductsResponse<TProduct> = ProductsResponse<TProduct>,
>(
  centraCheckout: CentraCheckoutCredentials,
  sessionContext: SessionContext,
  ids: string[],
) => {
  const response = await fetch(`${centraCheckout.url}/products`, {
    method: 'POST',
    body: JSON.stringify({
      ...sessionContext,
      products: ids,
      relatedProducts: true,
    }),
    headers: {
      Authorization: `Bearer ${centraCheckout.secret}`,
    },
  })

  const responseBody = (await response.json()) as TCentraProductsResponse

  return responseBody.products
}

function groupByMarketAndLanguage(sessionContexts: SessionContext[]) {
  const grouped = sessionContexts.reduce<
    Record<string, { market: string; pricelists: string[]; language: string }>
  >((acc, { market, pricelist, language }) => {
    // If this market and language pair hasn't been seen before, initialize an entry.
    if (!acc[`${market}-${language}`]) {
      acc[`${market}-${language}`] = { market, pricelists: [pricelist], language }
    } else {
      // Otherwise, add the current pricelist to the existing array.
      acc[`${market}-${language}`]?.pricelists.push(pricelist)
    }
    return acc
  }, {})

  // Convert the grouped object back into an array.
  return Object.values(grouped)
}

type PagesRouterApiAdapterOptions = {
  /**
   * The segment name of the API route.
   * If the file name is `[[...slug]]`, then the value should be `slug`.
   * @example `segments`
   */
  segmentName: string
  /**
   * Headers that will be applied to the response. Only applied on `200` responses
   */
  responseHeaders?: Headers
}
export function nextPagesAdapter<TProduct extends ProductBase>(
  callback: (sessionContext: SessionContext, ids: string[]) => Promise<TProduct[]>,
  options: PagesRouterApiAdapterOptions,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { segmentName } = options
    const { ids: idsParam } = req.query
    const segments = req.query[segmentName]

    assert(typeof idsParam === 'string', "search parameter 'ids' should be a string")
    assert(Array.isArray(segments), "search parameter 'segments' should be an array")

    const [market, pricelist, language] = segments

    assert(market, "missing search parameter 'market'")
    assert(pricelist, "missing search parameter 'pricelist'")
    assert(language, "missing search parameter 'language'")

    const ids = idsParam.split(',')

    const products = await callback({ market, pricelist, language }, ids)

    if (options.responseHeaders) {
      res.setHeaders(options.responseHeaders)
    }

    res.status(200).json(products)
  }
}

/**
 * Define Centra product cache server helpers.
 * Helpers to be called server-side to retrieve cached data from Centra.
 * To be used in conjunction with `createCentraProductCacheClientHelpers`
 */
export function createCentraProductCacheServerHelpers<TProduct extends ProductBase = ProductBase>(
  options: ServerHelperOptions<TProduct>,
) {
  const {
    cache,
    centraCheckout: centraCheckoutCredentials,
    getSessionContexts,
    formatProduct,
  } = options

  return {
    /**
     * Fetch products, using the Cache-Aside pattern.
     * Will primarily get products from the cache.
     * If one or more products were not resolved from cache, those products will be retrieved from
     * the Centra Checkout API.
     *
     * @param sessionContext - The session context to retrieve the products
     *
     * @see {@link https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside}
     */
    fetchProducts: async (sessionContext: SessionContext, ids: string[]) => {
      const configuredSessionContexts = await getSessionContexts()

      const isSessionContextConfigured = Boolean(
        configuredSessionContexts.find(
          (configuredSessionContext) =>
            configuredSessionContext.market === sessionContext.market &&
            configuredSessionContext.pricelist === sessionContext.pricelist &&
            configuredSessionContext.language === sessionContext.language,
        ),
      )

      const compareIdsByArgumentOrder = (a: string, b: string) => {
        const aIdx = ids.findIndex((id) => id === a)
        const bIdx = ids.findIndex((id) => id === b)

        return aIdx - bIdx
      }

      if (!isSessionContextConfigured) {
        // Since the passed session context is not known among the session contexts, we'll try to
        // fetch to perform the products request directly to source.
        // This is due to that we will not update this session context in our `updateProducts`
        // handler. If we would "Cache-Aside" these products, then we'll serve stale product data.
        return fetchProductsCentra<TProduct>(centraCheckoutCredentials, sessionContext, ids)
          .then((products) => products?.map(formatProduct) ?? [])
          .then((productsInner) =>
            productsInner.sort((a, b) => compareIdsByArgumentOrder(a.product, b.product)),
          )
      }

      return cacheAside(ids, {
        cache: {
          get: (idsInner: string[]) => cache.get(sessionContext, idsInner),
          set: (products: TProduct[]) => cache.set(sessionContext, products),
        },
        isHit: (id, cachedProducts) =>
          cachedProducts.some((cachedProduct) => cachedProduct.product === id),
        onMiss: async (idsNotFoundInCache: string[]) =>
          fetchProductsCentra(centraCheckoutCredentials, sessionContext, idsNotFoundInCache).then(
            (products) => products?.map(formatProduct) ?? [],
          ),
      }).then((productsInner) =>
        productsInner.sort((a, b) => compareIdsByArgumentOrder(a.product, b.product)),
      )
    },
    /**
     * Update products in cache.
     * Will update the various product versions, by each `sessionContext` retrieved from
     * `getSessionContexts`.
     *
     * @param ids - The product IDs to update.
     */
    updateProducts: async (
      ids: string[],
    ): Promise<ReturnType<ServerHelperOptions<TProduct>['cache']['set']>> => {
      const sessionContexts = await getSessionContexts()

      // Grouping pricelists by market and pricelist, to minimize requests.
      const sessionContextsByMarketAndLanguage = groupByMarketAndLanguage(sessionContexts)

      return Promise.all(
        sessionContextsByMarketAndLanguage.map(async (marketLanguagePricelists) => {
          const { market, language, pricelists } = marketLanguagePricelists

          const products = await fetchProductsCentra<{
            product: string
            prices: Record<string, unknown>
          }>(centraCheckoutCredentials, { market, language, pricelist: 'all' }, ids)

          // Inserting the products for each pricelist for the current market and language
          // combination.
          const results = await Promise.all(
            pricelists.map((pricelist) =>
              cache.set(
                { market, language, pricelist },
                products?.map((product) => {
                  const { prices, ...other } = product // @TODO: Will all products retrieve via `pricelist: 'all'` always have `prices` as an object?

                  return formatProduct({
                    ...other,
                    ...(prices[pricelist] as Record<string, unknown>),
                  })
                }) ?? [],
              ),
            ),
          )

          return results
        }),
      )
    },
  }
}
