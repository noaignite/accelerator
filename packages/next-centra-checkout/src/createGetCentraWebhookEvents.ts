import { type Events } from '@noaignite/centra-types'
import { isObject } from '@noaignite/utils'
import type { NextApiRequest } from 'next'
import crypto from 'node:crypto'

const sign = (secret: string, dataString: string) => {
  const hmac = crypto.createHmac('sha256', secret)

  hmac.update(dataString)

  return hmac.digest('hex')
}

/**
 * Parse a named parameters string into an object.
 * @example
 * ```ts
 * parseNamedParametersString('foo=bar,baz=qux') // { foo: 'bar', baz: 'qux' }
 * ```
 */
const parseNamedParametersString = (input: string): Record<string, string> => {
  return input.split(',').reduce<Record<string, string>>((acc, pair) => {
    const [key, value] = pair.split('=')
    if (!key || !value) {
      return acc
    }

    acc[key] = value

    return acc
  }, {})
}

/**
 * Parse raw request body, originating from Centra webhook plugin.
 */
const parseRawBody = (rawBody: unknown): { payload: string } | null => {
  if (rawBody && isObject(rawBody) && 'payload' in rawBody && typeof rawBody.payload === 'string') {
    return rawBody as { payload: string }
  }

  return null
}

export type CreateGetCentraWebhookEventsConfig<TRequest> = {
  adapter: {
    /**
     * Handler to determine request method of incoming request.
     */
    isRequestMethodPost?: (request: TRequest) => boolean
    /**
     * Handler to get request header.
     *
     */
    getHeader: (request: TRequest, headerKey: string) => string | null | undefined
    /**
     * Handler to get raw request body.
     */
    getRawBody: (request: TRequest) => unknown
  }
  /**
   * Endpoint secret, populated in the "Centra Webhooks" plugin.
   * Will be used to validate incoming requests, if not `null`.
   */
  secret: string | null
}

/**
 * Centra webhook events error.
 * Errors that could occur while validating / parsing incoming request that (should) originate from Centra.
 */
export type CentraWebhookEventsError =
  | [
    {
      /**
       * The incoming request method used from Centra is invalid.
       * The request method should be `"POST"`.
       */
      message: 'Invalid request method'
    },
  ]
  | [
    {
      /**
       * The incoming request didn't contain a signature.
       * @see https://centra.dev/docs/services/centra-webhooks#signature-verification
       */
      message: 'No signature'
    },
  ]
  | [
    {
      /**
       * The incoming request body is invalid.
       */
      message: 'Invalid request body'
    },
  ]
  | [
    {
      /**
       * The incoming signature is invalid.
       * @see https://centra.dev/docs/services/centra-webhooks#signature-verification
       */
      message: 'Invalid signature'
    },
  ] | [
    {
      /**
       * The incoming JSON payload is invalid.
       */
      message: 'Invalid JSON payload'
    },
  ]

export type CentraWebhookEventsData = [undefined, Partial<Record<Events, string[]>>]

export type CentraWebhookEventsResults = CentraWebhookEventsError | CentraWebhookEventsData

/**
 * Create get Centra webhook events.
 * Parses and returns the events from the incoming Centra request.
 *
 * @example
 * ```ts
 * const getCentraWebhookEvents = createGetCentraWebhookEvents({
 *   adapter: nextAppRouterAdapter
 * })
 *
 * const POST = async (request: Request) => {
 *   const [error, results] = await getCentraWebhookEvents(req)
 *
 *   if (error) {
 *     // Handle error codes
 *     return Response.json({ message: 'Error' }, { status: 500 })
 *   }
 *
 *   if ('products' in results) {
 *     return Response.json({ products: results.products }, { status: 200 })
 *   }
 * }
 * ```
 *
 * @see https://centra.dev/docs/services/centra-webhooks
 */
export function createGetCentraWebhookEvents<TRequest>(
  config: CreateGetCentraWebhookEventsConfig<TRequest>,
) {
  const { adapter, secret } = config
  const { getHeader, getRawBody, isRequestMethodPost } = adapter

  return async (request: TRequest): Promise<CentraWebhookEventsResults> => {
    if (isRequestMethodPost && !isRequestMethodPost(request)) {
      return [{ message: 'Invalid request method' as const }] as const
    }

    const rawBody = await getRawBody(request)
    const body = parseRawBody(rawBody)

    if (!body) {
      return [
        {
          message: 'Invalid request body',
        },
      ] satisfies CentraWebhookEventsError
    }

    if (secret) {
      const signature = getHeader(request, 'x-centra-signature')

      if (!signature) {
        return [
          {
            message: 'No signature',
          },
        ] satisfies CentraWebhookEventsError
      }

      const parameters = parseNamedParametersString(signature)

      // @see https://centra.dev/docs/extend-with-plugins/integrations/centra-webhooks#signature-verification
      if (
        sign(secret, `${parameters.t}.payload=${encodeURIComponent(body.payload)}`) !==
        parameters.v1
      ) {
        console.error('Invalid signature')

        return [{ message: 'Invalid signature' }] satisfies CentraWebhookEventsError
      }
    }

    try {
      const payloadParsed = JSON.parse(body.payload) as unknown

      return [undefined, payloadParsed] as CentraWebhookEventsData
    } catch (e) {
      console.error(e)

      return [{ message: 'Invalid JSON payload' }] satisfies CentraWebhookEventsError
    }
  }
}

/**
 * `app` router adapter, to be used with `createGetCentraWebhookEvents`
 */
export const nextAppRouterAdapter = {
  getHeader: (request, headerKey) => {
    return request.headers.get(headerKey)
  },
  getRawBody: async (request) => {
    const formData = await request.formData()

    // Returning an object representation of `FormData`
    return Object.fromEntries([...formData.entries()])
  },
} satisfies CreateGetCentraWebhookEventsConfig<Request>['adapter']

/**
 * `pages` router adapter, to be used with `createGetCentraWebhookEvents`
 */
export const nextPagesRouterAdapter = {
  isRequestMethodPost: (request) => {
    return request.method === 'POST'
  },
  getHeader: (request, headerKey) => {
    const header = request.headers[headerKey]

    if (Array.isArray(header)) {
      throw new Error(`Multiple headers with same key '${headerKey}' passed.`)
    }

    return header
  },
  getRawBody: (req) => {
    return req.body as unknown
  },
} satisfies CreateGetCentraWebhookEventsConfig<NextApiRequest>['adapter']
