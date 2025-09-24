import type { SessionContext } from './createCentraProductsCacheServerHelpers'

type ClientHelperOptions = {
  /**
   * Endpoint base path.
   * The returned API endpoint should be absolute, meaning either a full URL or a path beginning
   * with a `/`. The returned API endpoint should not contain any search parameters.
   *
   * @example `/api/centra`
   */
  endpointBasePath: string
}

/**
 * Create Centra product cache client helpers.
 * Helpers to be called client-side to retrieve cached data from Centra.
 * To be used in conjunction with `createCentraProductsCacheServerHelpers`
 */
export function createCentraProductsCacheClientHelpers<TProduct>(options: ClientHelperOptions) {
  const { endpointBasePath } = options

  return {
    /**
     * Fetch products.
     *
     * @param sessionContext -  The current users session context.
     * @param ids - The product IDs to be fetched.
     */
    fetchProducts: async (sessionContext: SessionContext, ids: string[], init?: RequestInit) => {
      const endpoint = `${endpointBasePath}/${sessionContext.market}/${sessionContext.pricelist}/${sessionContext.language}`

      return fetch(`${endpoint}?ids=${ids.join(',')}`, init).then(
        (response) => response.json() as Promise<TProduct[]>,
      )
    },
  }
}
