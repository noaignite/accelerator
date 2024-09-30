import { selectionEmptyResponse } from '@noaignite/centra-mocks'
import nock from 'nock'
import { describe, expect, it } from 'vitest'
import { ApiClient } from './index'

const CENTRA_API_URL = 'https://mock-centra-checkout.com/api'

describe('ApiClient', () => {
  it('Exposes a static instance via `default` property between instances', () => {
    nock(CENTRA_API_URL).persist().get('/selection').reply(200, selectionEmptyResponse)

    const apiClient = new ApiClient(CENTRA_API_URL)
    const otherApiClient = new ApiClient(CENTRA_API_URL)

    expect(apiClient.default).toBe(otherApiClient.default)
  })
})
