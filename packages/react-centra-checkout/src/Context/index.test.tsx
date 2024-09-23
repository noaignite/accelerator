import { selectionEmptyResponse, selectionResponse } from '@noaignite/centra-mocks'
import type * as CheckoutApi from '@noaignite/centra-types'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import nock from 'nock'
import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'
import { CentraProvider, SELECTION_INITIAL_VALUE, useCentraHandlers, useCentraSelection } from '.'

const CENTRA_API_URL = 'https://mock-centra-checkout.com/api'
const TEST_ITEM = '370-261'

nock(CENTRA_API_URL).persist().get('/selection').reply(200, selectionEmptyResponse)

function CentraProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CentraProvider
      apiUrl={CENTRA_API_URL}
      paymentFailedPage=""
      paymentReturnPage=""
      receiptPage=""
    >
      {children}
    </CentraProvider>
  )
}

describe('CentraProvider', () => {
  it('Renders children', () => {
    render(
      <CentraProvider disableInit paymentFailedPage="" paymentReturnPage="" receiptPage="">
        <div>Children</div>
      </CentraProvider>,
    )

    expect(screen.getByText('Children')).toBeDefined()
  })

  it('Sets ApiClient api-token header', async () => {
    const { result } = renderHook(useCentraSelection, {
      wrapper: CentraProviderWrapper,
    })

    const { apiClient } = result.current

    await waitFor(() => {
      expect(apiClient?.headers.get('api-token')).toEqual(selectionEmptyResponse.token)
    })
  })

  it('Initalizes selection', async () => {
    const { result } = renderHook(useCentraSelection, {
      wrapper: CentraProviderWrapper,
    })

    await waitFor(() => {
      expect(result.current.selection).toEqual(selectionEmptyResponse.selection)
    })
  })

  it.concurrent("doesn't initialize selection when passing `disableInit`", async () => {
    const { result } = renderHook(useCentraSelection, {
      wrapper: ({ children }) => (
        <CentraProvider
          apiUrl={CENTRA_API_URL}
          disableInit
          paymentFailedPage=""
          paymentReturnPage=""
          receiptPage=""
        >
          {children}
        </CentraProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.selection).toEqual(SELECTION_INITIAL_VALUE.selection)
    })
  })

  it.concurrent('applies `initialSelection` as `selection` when passed as argument', async () => {
    const initialSelection = {
      ...selectionEmptyResponse,
      additionalNotes: Math.random(),
    }

    const { result } = renderHook(useCentraSelection, {
      wrapper: ({ children }) => (
        <CentraProvider
          apiUrl={CENTRA_API_URL}
          disableInit
          initialSelection={initialSelection}
          paymentFailedPage=""
          paymentReturnPage=""
          receiptPage=""
        >
          {children}
        </CentraProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.selection?.additionalNotes).toEqual(
        initialSelection.selection?.additionalNotes,
      )
    })
  })

  describe('addItem', () => {
    it('Adds one item', async () => {
      nock(CENTRA_API_URL).post(`/items/${TEST_ITEM}/quantity/1`).reply(201, selectionResponse)

      let resultingSelection: CheckoutApi.Selection | undefined

      function TestComponent() {
        const { selection } = useCentraSelection()
        const { addItem } = useCentraHandlers()

        // set resultingSelection to be able to test the selection
        resultingSelection = selection

        useEffect(() => {
          setTimeout(() => {
            void addItem?.(TEST_ITEM)
          }, 100)
        }, [addItem])

        return null
      }

      render(<TestComponent />, { wrapper: CentraProviderWrapper })

      await waitFor(() => {
        expect(resultingSelection?.items?.length).toBe(1)
      })
    })

    it('Adds two items', async () => {
      nock(CENTRA_API_URL)
        .post(`/items/${TEST_ITEM}/quantity/2`)
        .reply(201, () => ({
          ...selectionResponse,
          selection: {
            ...selectionResponse.selection,
            // @ts-expect-error -- We could expect the test to fail during runtime if the mock data doesn't comply with the logic. The TypeScript error originates from the type and not the actual mock.
            items: Array(2).fill(selectionResponse.selection.items[0]),
          },
        }))

      let resultingSelection: CheckoutApi.Selection | undefined

      function TestComponent() {
        const { selection } = useCentraSelection()
        const { addItem } = useCentraHandlers()

        // set resultingSelection to be able to test the selection
        resultingSelection = selection

        useEffect(() => {
          setTimeout(() => {
            void addItem?.(TEST_ITEM, 2)
          }, 100)
        }, [addItem])

        return null
      }

      render(<TestComponent />, { wrapper: CentraProviderWrapper })

      await waitFor(() => {
        expect(resultingSelection?.items?.length).toBe(2)
      })
    })

    it("Doesn't remove the selection state when product item not found", async () => {
      nock(CENTRA_API_URL)
        .post(`/items/${TEST_ITEM}/quantity/2`)
        .reply(404, () => ({
          token: 'e37b0c13e1gv4bdkceigir9go5',
          errors: {
            item: 'product item not found',
          },
        }))

      let resultingSelection: CheckoutApi.Selection | undefined

      function TestComponent() {
        const { selection } = useCentraSelection()
        const { addItem } = useCentraHandlers()

        // set resultingSelection to be able to test the selection
        resultingSelection = selection

        useEffect(() => {
          setTimeout(() => {
            void addItem?.(TEST_ITEM, 2)
          }, 100)
        }, [addItem])

        return null
      }

      render(<TestComponent />, { wrapper: CentraProviderWrapper })

      await waitFor(() => {
        expect(resultingSelection?.items?.length).toBe(0)
      })
    })
  })

  describe.each([
    {
      handlerName: 'addItem',
      handlerArgs: ['123'],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/items/123/quantity/1',
        },
      ],
    },
    {
      handlerName: 'addBundleItem',
      handlerArgs: [
        '123',
        {
          item: '60-29',
          sections: [
            {
              section: '435',
              item: '60-31',
            },
            {
              section: '436',
              item: '60-30',
            },
          ],
          localizedProdSize: {
            localizationDefinitionName: 'US',
            localizedSize: '39 inches',
          },
        },
      ],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/items/bundles/123',
          requestBody: {
            item: '60-29',
            sections: [
              {
                section: '435',
                item: '60-31',
              },
              {
                section: '436',
                item: '60-30',
              },
            ],
            localizedProdSize: {
              localizationDefinitionName: 'US',
              localizedSize: '39 inches',
            },
          },
        },
      ],
    },
    {
      handlerName: 'addGiftCertificate',
      handlerArgs: ['foo'],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/items/gift-certificates/foo',
        },
      ],
    },
    {
      handlerName: 'addCustomGiftCertificate',
      handlerArgs: ['foo', 2],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/items/gift-certificates/foo/amount/2',
        },
      ],
    },
    {
      handlerName: 'increaseCartItem',
      handlerArgs: ['1001'],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/lines/1001/quantity/1',
        },
      ],
    },
    {
      handlerName: 'decreaseCartItem',
      handlerArgs: ['1001'],
      interceptors: [
        {
          httpMethod: 'DELETE',
          endpoint: '/lines/1001/quantity/1',
        },
      ],
    },
    {
      handlerName: 'removeCartItem',
      handlerArgs: ['1001'],
      interceptors: [
        {
          httpMethod: 'DELETE',
          endpoint: '/lines/1001',
        },
      ],
    },
    {
      handlerName: 'updateCartItemQuantity',
      handlerArgs: ['1001', 4],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/lines/1001/quantity/4',
        },
      ],
    },
    {
      handlerName: 'updateCartItemSize',
      handlerArgs: [
        {
          line: '1001',
          quantity: 5,
        },
        '2002',
      ],
      interceptors: [
        {
          httpMethod: 'DELETE',
          endpoint: '/lines/1001',
        },
        {
          httpMethod: 'POST',
          endpoint: '/items/2002/quantity/5',
        },
      ],
    },
    {
      handlerName: 'addVoucher',
      handlerArgs: ['voucher-name'],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/vouchers',
        },
      ],
    },
    {
      handlerName: 'removeVoucher',
      handlerArgs: ['voucher-name'],
      interceptors: [
        {
          httpMethod: 'DELETE',
          endpoint: '/vouchers/voucher-name',
        },
      ],
    },
    {
      handlerName: 'updateCountry',
      handlerArgs: ['US'],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/countries/US',
        },
      ],
    },
    {
      handlerName: 'updateLanguage',
      handlerArgs: ['en'],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/languages/en',
        },
      ],
    },
    {
      handlerName: 'updateShippingMethod',
      handlerArgs: ['acme'],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/shipping-methods/acme',
        },
      ],
    },
    {
      handlerName: 'updatePaymentMethod',
      handlerArgs: ['acme'],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/payment-methods/acme',
        },
      ],
    },
    {
      handlerName: 'updatePaymentFields',
      handlerArgs: [
        {
          language: 'en',
          address: {
            firstName: 'Peter',
            lastName: 'Petersson',
            address1: 'Street 1',
            zipCode: '12345',
            city: 'Stockholm',
            country: 'SE',
          },
          shippingAddress: {
            firstName: 'Peter',
            lastName: 'Petersson',
            address1: 'Street 1',
            zipCode: '90210',
            city: 'San Francisco',
            country: 'US',
            state: 'CA',
          },
        },
      ],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/payment-fields',
          requestBody: {
            language: 'en',
            address: {
              firstName: 'Peter',
              lastName: 'Petersson',
              address1: 'Street 1',
              zipCode: '12345',
              city: 'Stockholm',
              country: 'SE',
            },
            shippingAddress: {
              firstName: 'Peter',
              lastName: 'Petersson',
              address1: 'Street 1',
              zipCode: '90210',
              city: 'San Francisco',
              country: 'US',
              state: 'CA',
            },
          },
        },
      ],
    },
  ] as const)('$handlerName(...$handlerArgs)', (options) => {
    const { handlerName, handlerArgs, interceptors } = options

    const scope = nock(CENTRA_API_URL)

    function TestComponent() {
      const handler = useCentraHandlers()[handlerName]

      useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- To avoid passing `as const` in the test declarations above, we silent the error here instead.
        // @ts-expect-error
        void handler?.(...handlerArgs)
      }, [handler])

      return null
    }

    it('performs requests accordingly', async () => {
      interceptors.forEach((interceptor) => {
        const { httpMethod, endpoint } = interceptor
        const requestBody = 'requestBody' in interceptor ? interceptor.requestBody : null

        scope
          .intercept(endpoint, httpMethod, (retrievedRequestBody) => {
            if (requestBody) {
              // If we've specified an expected request body, we shall assure that this request body get sent to the API endpoint.
              expect(JSON.stringify(retrievedRequestBody) === JSON.stringify(requestBody)).toBe(
                true,
              )
            }

            return true
          })
          .reply(
            200,
            // Just need to respond with a JSON-parseable response body.
            {
              foo: 'bar',
            },
          )
      })

      render(<TestComponent />, { wrapper: CentraProviderWrapper })

      await waitFor(() => {
        // using `isDone` as indicator that all generated interceptors are used and therefore handlers perform API requests as expected.
        expect(scope.isDone()).toBe(true)
      })
    })
  })
})
