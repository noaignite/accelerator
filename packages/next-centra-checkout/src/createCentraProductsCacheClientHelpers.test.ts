import nock from 'nock'
import { describe, expect, it } from 'vitest'
import { createCentraProductsCacheClientHelpers } from './createCentraProductsCacheClientHelpers'

describe('createCentraProductsCacheClientHelpers', () => {
  const hostname = 'http://localhost:3000'
  const path = 'api/centra'
  const endpointBasePath = `${hostname}/${path}`
  const { fetchProducts } = createCentraProductsCacheClientHelpers({
    endpointBasePath,
  })

  it('returns a fetchProducts callback', () => {
    expect(fetchProducts).toBeDefined()
  })

  describe('fetchProducts', () => {
    it('performs a GET request by the passed endpoint base path', async () => {
      const market = '1'
      const pricelist = '2'
      const language = 'en'
      const id = '123'

      const mockedProduct = { product: id }

      const scope = nock(hostname)
        .get(`/${path}/${market}/${pricelist}/${language}?ids=${id}`)
        .reply(200, [mockedProduct])

      const results = await fetchProducts(
        {
          market,
          pricelist,
          language,
        },
        [id],
      )

      expect(scope.isDone()).toBe(true)
      expect(results[0]).toMatchObject(mockedProduct)
    })
  })
})
