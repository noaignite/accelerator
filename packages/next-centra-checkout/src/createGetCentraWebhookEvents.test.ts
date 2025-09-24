import type { NextApiRequest } from 'next'
import crypto from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import {
  createGetCentraWebhookEvents,
  nextAppRouterAdapter,
  nextPagesRouterAdapter,
} from './createGetCentraWebhookEvents'

vi.mock('node:crypto', async () => {
  return {
    default: {
      createHmac: vi.fn().mockReturnValue({
        update: vi.fn(),
        digest: vi.fn().mockReturnValue('valid-signature'),
      }),
    },
  }
})

describe('createGetCentraWebhookEvents', () => {
  describe('with secret', () => {
    const mockSecret = 'test-secret'
    const mockPayload = JSON.stringify({ products: ['product-1'] })
    const mockTimestamp = '1234567890'
    const mockSignature = `t=${mockTimestamp},v1=valid-signature`

    it('validates signature correctly', async () => {
      // Arrange
      const mockRequest = {
        method: 'POST',
        headers: {
          'x-centra-signature': mockSignature,
        },
        body: {
          payload: mockPayload,
        },
      } as unknown as NextApiRequest // Only mocking the properties used internally of the function.

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: {
          isRequestMethodPost: () => true,
          getHeader: (req: NextApiRequest, key) => req.headers[key] as string,
          getRawBody: () => Promise.resolve(mockRequest.body),
        },
        secret: mockSecret,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest)

      // Assert
      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', mockSecret)
      expect(result).toEqual([undefined, JSON.parse(mockPayload)])
    })

    it('returns error for invalid signature', async () => {
      // Arrange
      const mockRequest = {
        method: 'POST',
        headers: {
          'x-centra-signature': 't=1234567890,v1=invalid-signature',
        },
        body: {
          payload: mockPayload,
        },
      } as unknown as NextApiRequest // Only mocking the properties used internally of the function.

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: {
          isRequestMethodPost: () => true,
          getHeader: (req: NextApiRequest, key) => req.headers[key] as string,
          getRawBody: () => Promise.resolve(mockRequest.body),
        },
        secret: mockSecret,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest)

      // Assert
      expect(result).toEqual([{ message: 'Invalid signature' }])
    })

    it('returns error when no signature is provided', async () => {
      // Arrange
      const mockRequest = {
        method: 'POST',
        headers: {},
        body: {
          payload: mockPayload,
        },
      }

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: {
          isRequestMethodPost: () => true,
          getHeader: () => undefined,
          getRawBody: () => Promise.resolve(mockRequest.body),
        },
        secret: mockSecret,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest)

      // Assert
      expect(result).toEqual([{ message: 'No signature' }])
    })
  })

  describe('without secret', () => {
    it('skips signature validation when secret is null', async () => {
      // Arrange
      const mockPayload = JSON.stringify({ products: ['product-1'] })
      const mockRequest = {
        method: 'POST',
        headers: {},
        body: {
          payload: mockPayload,
        },
      }

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: {
          isRequestMethodPost: () => true,
          getHeader: () => undefined,
          getRawBody: () => Promise.resolve(mockRequest.body),
        },
        secret: null,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest)

      // Assert
      expect(result).toEqual([undefined, JSON.parse(mockPayload)])
    })
  })

  describe('request validation', () => {
    it('returns error for non-POST requests', async () => {
      // Arrange
      const mockRequest = {
        method: 'GET',
        headers: {},
        body: {},
      }

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: {
          isRequestMethodPost: () => false,
          getHeader: () => undefined,
          getRawBody: () => Promise.resolve({}),
        },
        secret: null,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest)

      // Assert
      expect(result).toEqual([{ message: 'Invalid request method' }])
    })

    it('returns error for invalid request body', async () => {
      // Arrange
      const mockRequest = {
        method: 'POST',
        headers: {},
        body: 'invalid-body',
      }

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: {
          isRequestMethodPost: () => true,
          getHeader: () => undefined,
          getRawBody: () => Promise.resolve('invalid-body'),
        },
        secret: null,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest)

      // Assert
      expect(result).toEqual([{ message: 'Invalid request body' }])
    })
  })

  describe('adapters', () => {
    it('nextAppRouterAdapter works correctly', async () => {
      // Arrange
      const mockFormData = new FormData()
      mockFormData.append('payload', JSON.stringify({ products: ['product-1'] }))

      const mockRequest = {
        headers: new Headers({
          'x-centra-signature': 't=1234567890,v1=valid-signature',
        }),
        formData: () => Promise.resolve(mockFormData),
      }

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: nextAppRouterAdapter,
        secret: null,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest as unknown as Request)

      // Assert
      expect(result[0]).toBeUndefined()
      expect(result[1]).toEqual({ products: ['product-1'] })
    })

    it('nextPagesRouterAdapter works correctly', async () => {
      // Arrange
      const mockRequest = {
        method: 'POST',
        headers: {
          'x-centra-signature': 't=1234567890,v1=valid-signature',
        },
        body: {
          payload: JSON.stringify({ products: ['product-1'] }),
        },
      } as unknown as NextApiRequest // Only mocking the properties used internally of the function.

      const getCentraWebhookEvents = createGetCentraWebhookEvents({
        adapter: nextPagesRouterAdapter,
        secret: null,
      })

      // Act
      const result = await getCentraWebhookEvents(mockRequest)

      // Assert
      expect(nextPagesRouterAdapter.getHeader(mockRequest, 'x-centra-signature')).toBe(
        't=1234567890,v1=valid-signature',
      )
      expect(result[0]).toBeUndefined()
      expect(result[1]).toEqual({ products: ['product-1'] })
    })
  })
})
