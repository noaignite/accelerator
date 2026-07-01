import { selectionEmptyResponse, selectionResponse } from '@noaignite/centra-mocks'
import type * as CheckoutApi from '@noaignite/centra-types'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import nock from 'nock'
import type { ComponentProps } from 'react'
import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ApiClient,
  CentraProvider,
  SELECTION_INITIAL_VALUE,
  useCentraEvents,
  useCentraHandlers,
  useCentraOrders,
  useCentraReceipt,
  useCentraSelection,
} from '.'
import { CentraEvents, EVENTS } from './internal/CentraEvents'

const CENTRA_API_URL = 'https://mock-centra-checkout.com/api'
const TEST_ITEM = '370-261'

nock(CENTRA_API_URL).persist().get('/selection').reply(200, selectionEmptyResponse)

const CentraProviderWrapper = (props: Partial<ComponentProps<typeof CentraProvider>>) => {
  const { children, ...other } = props
  return (
    <CentraProvider
      apiUrl={CENTRA_API_URL}
      paymentFailedPage=""
      paymentReturnPage=""
      receiptPage=""
      {...other}
    >
      {children}
    </CentraProvider>
  )
}

describe('CentraProvider', () => {
  beforeEach(() => {
    // overwrite the global location with a plain object
    vi.stubGlobal('location', {
      href: '',
    })
  })

  afterEach(() => {
    const centraEvents = CentraEvents.default

    EVENTS.forEach((eventName) => {
      centraEvents.eventHandlers[eventName]?.clear()
    })
  })

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

    it('dispatches addItem event when response includes selection', async () => {
      nock(CENTRA_API_URL).post(`/items/${TEST_ITEM}/quantity/1`).reply(201, selectionResponse)

      const callback = vi.fn()

      function TestComponent() {
        const { addItem } = useCentraHandlers()
        const centraEvents = useCentraEvents()

        useEffect(() => {
          centraEvents.on('addItem', callback)
          void addItem?.(TEST_ITEM)

          return () => {
            centraEvents.off('addItem', callback)
          }
        }, [addItem, centraEvents])

        return null
      }

      render(
        <CentraProvider
          apiUrl={CENTRA_API_URL}
          disableInit
          initialSelection={selectionEmptyResponse}
          paymentFailedPage=""
          paymentReturnPage=""
          receiptPage=""
        >
          <TestComponent />
        </CentraProvider>,
      )

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(selectionResponse, TEST_ITEM, 1)
      })
    })

    it('dispatches addItem event when response does not include selection', async () => {
      const errorResponse = {
        token: 'e37b0c13e1gv4bdkceigir9go5',
        errors: {
          item: 'product item not found',
        },
      }

      nock(CENTRA_API_URL).post(`/items/${TEST_ITEM}/quantity/1`).reply(404, errorResponse)

      const callback = vi.fn()
      let resultingSelection: CheckoutApi.Selection | undefined

      function TestComponent() {
        const { selection } = useCentraSelection()
        const { addItem } = useCentraHandlers()
        const centraEvents = useCentraEvents()

        resultingSelection = selection

        useEffect(() => {
          centraEvents.on('addItem', callback)
          void addItem?.(TEST_ITEM)

          return () => {
            centraEvents.off('addItem', callback)
          }
        }, [addItem, centraEvents])

        return null
      }

      render(
        <CentraProvider
          apiUrl={CENTRA_API_URL}
          disableInit
          initialSelection={selectionEmptyResponse}
          paymentFailedPage=""
          paymentReturnPage=""
          receiptPage=""
        >
          <TestComponent />
        </CentraProvider>,
      )

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(errorResponse, TEST_ITEM, 1)
      })

      expect(resultingSelection).toEqual(selectionEmptyResponse.selection)
    })
  })

  describe('submitPayment', () => {
    describe('when paymentReturnPage and paymentFailedPage props are callbacks', () => {
      it('passes returned strings parameters to POST /payment', async () => {
        const scope = nock(CENTRA_API_URL)

        const helpers = {
          paymentReturnPage: ({ token }) => `/payment/return/${token}`,
          paymentFailedPage: ({ token }) => `/payment/failed/${token}`,
        } satisfies Pick<
          React.ComponentProps<typeof CentraProvider>,
          'paymentReturnPage' | 'paymentFailedPage'
        >

        scope
          .post('/payment', (retrievedRequestBody) => {
            expect(retrievedRequestBody.paymentReturnPage).toBe(
              helpers.paymentReturnPage(selectionEmptyResponse),
            )
            expect(retrievedRequestBody.paymentFailedPage).toBe(
              helpers.paymentFailedPage(selectionEmptyResponse),
            )

            return true
          })
          .reply(
            200,
            // Just need to respond with a JSON-parseable response body.
            {
              token: 'foo',
              action: 'redirect',
              url: 'https://example.com/checkout',
            },
          )

        function TestComponent() {
          const { submitPayment } = useCentraHandlers()
          const { token } = useCentraSelection()

          useEffect(() => {
            if (token) {
              void submitPayment?.({
                address: {},
              })
            }
          }, [submitPayment, token])

          return null
        }

        render(<TestComponent />, {
          wrapper: (props) => {
            return (
              <CentraProvider
                paymentFailedPage={({ token }) => `/payment/failed/${token}`}
                paymentReturnPage={({ token }) => `/payment/return/${token}`}
                receiptPage="/receipt-page"
                {...props}
              />
            )
          },
        })

        await waitFor(async () => {
          // using `isDone` as indicator that all generated interceptors are used and therefore handlers perform API requests as expected.
          expect(scope.isDone()).toBe(true)
        })
      })

      it('dispatches submitPayment event on success responses', async () => {
        const paymentRequest = {
          address: {
            firstName: 'Peter',
          },
        }
        const paymentResponse = {
          token: 'foo',
          action: 'redirect',
          url: 'https://example.com/checkout',
        }

        nock(CENTRA_API_URL).post('/payment').reply(200, paymentResponse)

        const callback = vi.fn()

        function TestComponent() {
          const { submitPayment } = useCentraHandlers()
          const { token } = useCentraSelection()
          const centraEvents = useCentraEvents()

          useEffect(() => {
            if (token) {
              centraEvents.on('submitPayment', callback)
              void submitPayment?.(paymentRequest)
            }

            return () => {
              centraEvents.off('submitPayment', callback)
            }
          }, [centraEvents, submitPayment, token])

          return null
        }

        render(<TestComponent />, { wrapper: CentraProviderWrapper })

        await waitFor(() => {
          expect(callback).toHaveBeenCalledWith(paymentResponse, paymentRequest)
        })
      })

      it('dispatches submitPayment event on error responses', async () => {
        const paymentRequest = {
          address: {
            firstName: 'Peter',
          },
        }
        const paymentResponse = {
          errors: {
            payment: 'Payment failed',
          },
        }

        nock(CENTRA_API_URL).post('/payment').reply(400, paymentResponse)

        const callback = vi.fn()

        function TestComponent() {
          const { submitPayment } = useCentraHandlers()
          const { token } = useCentraSelection()
          const centraEvents = useCentraEvents()

          useEffect(() => {
            if (token) {
              centraEvents.on('submitPayment', callback)
              void submitPayment?.(paymentRequest).catch(() => undefined)
            }

            return () => {
              centraEvents.off('submitPayment', callback)
            }
          }, [centraEvents, submitPayment, token])

          return null
        }

        render(<TestComponent />, { wrapper: CentraProviderWrapper })

        await waitFor(() => {
          expect(callback).toHaveBeenCalledWith(paymentResponse, paymentRequest)
        })
      })
    })
  })

  describe('hook events', () => {
    it('dispatches useCentraReceipt event with the fetched receipt response', async () => {
      const receiptResponse = {
        order: {
          orderNumber: '1234',
        },
      }

      nock(CENTRA_API_URL).get('/receipt').reply(200, receiptResponse)

      const callback = vi.fn()
      const centraEvents = useCentraEvents()

      centraEvents.on('useCentraReceipt', callback)

      renderHook(() => useCentraReceipt(selectionEmptyResponse.token!), {
        wrapper: ({ children }) => (
          <CentraProvider
            apiUrl={CENTRA_API_URL}
            disableInit
            initialSelection={selectionEmptyResponse}
            paymentFailedPage=""
            paymentReturnPage=""
            receiptPage=""
          >
            {children}
          </CentraProvider>
        ),
      })

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(receiptResponse)
      })

      centraEvents.off('useCentraReceipt', callback)
    })

    it('dispatches useCentraOrders event with the fetched orders response', async () => {
      const ordersResponse = {
        orders: [
          {
            orderNumber: '1234',
          },
        ],
      }

      nock(CENTRA_API_URL).post('/orders', { from: 1, size: 5 }).reply(200, ordersResponse)

      const callback = vi.fn()
      const centraEvents = useCentraEvents()
      const apiClient = new ApiClient(CENTRA_API_URL)

      centraEvents.on('useCentraOrders', callback)

      renderHook(() => useCentraOrders(1, 5, apiClient))

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(ordersResponse)
      })

      centraEvents.off('useCentraOrders', callback)
    })
  })

  describe.each([
    {
      handlerName: 'addItem',
      handlerArgs: ['123'],
      expectedEventArgs: ['123', 1],
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
      expectedEventArgs: [
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
    },
    {
      handlerName: 'addGiftCertificate',
      handlerArgs: ['foo'],
      expectedEventArgs: ['foo'],
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
      expectedEventArgs: ['foo', 2],
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
      expectedEventArgs: ['1001'],
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
      expectedEventArgs: ['1001'],
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
      expectedEventArgs: ['1001'],
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
      expectedEventArgs: ['1001', 4],
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
      expectedEventArgs: [
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
      handlerName: 'addBackInStockSubscription',
      handlerArgs: [
        {
          email: 'test@example.com',
          item: '123',
        },
      ],
      expectedEventArgs: [
        {
          email: 'test@example.com',
          item: '123',
        },
      ],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/back-in-stock-subscription',
          requestBody: {
            email: 'test@example.com',
            item: '123',
          },
        },
      ],
    },
    {
      handlerName: 'addNewsletterSubscription',
      handlerArgs: [
        {
          email: 'newsletter@example.com',
        },
      ],
      expectedEventArgs: [
        {
          email: 'newsletter@example.com',
        },
      ],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/newsletter-subscription',
          requestBody: {
            email: 'newsletter@example.com',
          },
        },
      ],
    },
    {
      handlerName: 'addVoucher',
      handlerArgs: ['voucher-name'],
      expectedEventArgs: ['voucher-name'],
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
      expectedEventArgs: ['voucher-name'],
      interceptors: [
        {
          httpMethod: 'DELETE',
          endpoint: '/vouchers/voucher-name',
        },
      ],
    },
    {
      handlerName: 'updateCountry',
      handlerArgs: ['US', { language: 'en' }],
      expectedEventArgs: ['US', { language: 'en' }],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/countries/US',
          requestBody: {
            language: 'en',
          },
        },
      ],
    },
    {
      handlerName: 'updateLanguage',
      handlerArgs: ['en'],
      expectedEventArgs: ['en'],
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
      expectedEventArgs: ['acme'],
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
      expectedEventArgs: ['acme'],
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
      expectedEventArgs: [
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
    },
    {
      handlerName: 'loginCustomer',
      handlerArgs: ['customer@example.com', 'hunter2'],
      expectedEventArgs: ['customer@example.com', 'hunter2'],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/login/customer@example.com',
          requestBody: {
            password: 'hunter2',
          },
        },
      ],
    },
    {
      handlerName: 'logoutCustomer',
      handlerArgs: [],
      expectedEventArgs: [],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/logout',
        },
      ],
    },
    {
      handlerName: 'registerCustomer',
      handlerArgs: [
        {
          email: 'customer@example.com',
          password: 'hunter2',
        },
      ],
      expectedEventArgs: [
        {
          email: 'customer@example.com',
          password: 'hunter2',
        },
      ],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/register',
          requestBody: {
            email: 'customer@example.com',
            password: 'hunter2',
          },
        },
      ],
    },
    {
      handlerName: 'resetCustomerPassword',
      handlerArgs: ['param-i', 'param-id', 'new-password'],
      expectedEventArgs: ['param-i', 'param-id', 'new-password'],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/password-reset',
          requestBody: {
            i: 'param-i',
            id: 'param-id',
            newPassword: 'new-password',
          },
        },
      ],
    },
    {
      handlerName: 'sendCustomerResetPasswordEmail',
      handlerArgs: ['customer@example.com', 'account/password-reset'],
      expectedEventArgs: ['customer@example.com', 'account/password-reset'],
      interceptors: [
        {
          httpMethod: 'POST',
          endpoint: '/password-reset-email/customer@example.com',
          requestBody: {
            linkUri: 'account/password-reset',
          },
        },
      ],
    },
    {
      handlerName: 'updateCustomer',
      handlerArgs: [
        {
          firstName: 'Peter',
        },
      ],
      expectedEventArgs: [
        {
          firstName: 'Peter',
        },
      ],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/customer/update',
          requestBody: {
            firstName: 'Peter',
          },
        },
      ],
    },
    {
      handlerName: 'updateCustomerAddress',
      handlerArgs: [
        {
          address1: 'Street 1',
          city: 'Stockholm',
        },
      ],
      expectedEventArgs: [
        {
          address1: 'Street 1',
          city: 'Stockholm',
        },
      ],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/address',
          requestBody: {
            address1: 'Street 1',
            city: 'Stockholm',
          },
        },
      ],
    },
    {
      handlerName: 'updateCustomerEmail',
      handlerArgs: ['new@example.com'],
      expectedEventArgs: ['new@example.com'],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/email',
          requestBody: {
            newEmail: 'new@example.com',
          },
        },
      ],
    },
    {
      handlerName: 'updateCustomerPassword',
      handlerArgs: ['hunter2', 'new-password'],
      expectedEventArgs: ['hunter2', 'new-password'],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/password',
          requestBody: {
            password: 'hunter2',
            newPassword: 'new-password',
          },
        },
      ],
    },
    {
      handlerName: 'updateCampaignSite',
      handlerArgs: ['/campaign/summer'],
      expectedEventArgs: ['/campaign/summer'],
      interceptors: [
        {
          httpMethod: 'PUT',
          endpoint: '/campaign-site',
          requestBody: {
            uri: '/campaign/summer',
          },
        },
      ],
    },
  ] as const)('$handlerName(...$handlerArgs)', (options) => {
    const { handlerName, handlerArgs, interceptors, expectedEventArgs } = options

    const responseBody = {
      foo: 'bar',
    }

    const setupInterceptors = () => {
      const scope = nock(CENTRA_API_URL)

      interceptors.forEach((interceptor) => {
        const { httpMethod, endpoint } = interceptor
        const requestBody = 'requestBody' in interceptor ? interceptor.requestBody : null

        scope
          .intercept(endpoint, httpMethod, (retrievedRequestBody) => {
            if (requestBody) {
              // If we've specified an expected request body, we shall assure that this request body get sent to the API endpoint.
              // eslint-disable-next-line vitest/no-conditional-expect -- This is fine
              expect(JSON.stringify(retrievedRequestBody) === JSON.stringify(requestBody)).toBe(
                true,
              )
            }

            return true
          })
          .reply(200, responseBody)
      })

      return scope
    }

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
      const scope = setupInterceptors()

      render(<TestComponent />, { wrapper: CentraProviderWrapper })

      await waitFor(() => {
        // using `isDone` as indicator that all generated interceptors are used and therefore handlers perform API requests as expected.
        expect(scope.isDone()).toBe(true)
      })
    })

    it('dispatches the matching event with the response and handler args', async () => {
      const scope = setupInterceptors()
      const callback = vi.fn()

      function TestComponentWithEventListener() {
        const handler = useCentraHandlers()[handlerName]
        const centraEvents = useCentraEvents()

        useEffect(() => {
          centraEvents.on(handlerName, callback)

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- To avoid passing `as const` in the test declarations above, we silent the error here instead.
          // @ts-expect-error
          void handler?.(...handlerArgs)

          return () => {
            centraEvents.off(handlerName, callback)
          }
        }, [centraEvents, handler])

        return null
      }

      render(<TestComponentWithEventListener />, { wrapper: CentraProviderWrapper })

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(responseBody, ...expectedEventArgs)
        expect(scope.isDone()).toBe(true)
      })
    })
  })
})
