import { selectionEmptyResponse } from '@noaignite/centra-mocks'
import { render, screen, waitFor } from '@testing-library/react'
import nock from 'nock'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CentraProvider } from './Context'
import { PaymentEmbed } from './PaymentEmbed'

const CENTRA_API_URL = 'https://mock-centra-checkout.com/api'

const mockGetSelection = (scope: nock.Scope, selectionReponse: Record<string, unknown>) => {
  return scope.get('/selection').reply(200, selectionReponse)
}

function CentraProviderWrapper(props: { children: React.ReactNode }) {
  return (
    <CentraProvider
      apiUrl={CENTRA_API_URL}
      paymentFailedPage=""
      paymentReturnPage=""
      receiptPage=""
      {...props}
    />
  )
}

describe('PaymentEmbed', () => {
  const mockProps = {
    values: {
      address: {},
    },
    onPaymentSuccess: vi.fn(),
    onPaymentError: vi.fn(),
  }

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Cleanup after each test
    vi.restoreAllMocks()
  })

  it('renders formHtml if current paymentMethod supports initiateOnly', async () => {
    const scope = nock(CENTRA_API_URL)

    mockGetSelection(scope, {
      ...selectionEmptyResponse,
      selection: {
        ...selectionEmptyResponse.selection,
        paymentMethod: selectionEmptyResponse.paymentMethods?.[0]?.paymentMethod,
      },
      paymentMethods: [
        {
          ...selectionEmptyResponse.paymentMethods?.[0],
          supportsInitiateOnly: true,
        },
      ],
    })

    scope.post('/payment').reply(200, {
      formHtml: '<div data-testid="injected-form">Injected form</div>',
    })

    render(<PaymentEmbed {...mockProps} />, { wrapper: CentraProviderWrapper })

    await waitFor(() => {
      expect(screen.getByTestId('injected-form')).toBeDefined()
    })
  })

  it('calls onPaymentSuccess on successful response on dispatch of `centra_checkout_payment_callback`', async () => {
    const scope = mockGetSelection(nock(CENTRA_API_URL), {
      ...selectionEmptyResponse,
      selection: {
        ...selectionEmptyResponse.selection,
        paymentMethod: selectionEmptyResponse.paymentMethods?.[0]?.paymentMethod,
      },
      paymentMethods: [
        {
          ...selectionEmptyResponse.paymentMethods?.[0],
          supportsInitiateOnly: true,
        },
      ],
    })

    scope.post('/payment').reply(200, {
      formHtml: '<div data-testid="injected-form">Injected form</div>',
    })

    const mockedAddEventListener = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(() => {})

    render(<PaymentEmbed {...mockProps} />, { wrapper: CentraProviderWrapper })

    await waitFor(() => {
      expect(mockedAddEventListener).toHaveBeenCalledWith(
        'centra_checkout_payment_callback',
        expect.any(Function),
      )
    })
  })

  describe('handlePaymentCallback', () => {
    it('sources address from event if `addressIncluded: true` in `event.detail`', async () => {
      const scope = mockGetSelection(nock(CENTRA_API_URL), {
        ...selectionEmptyResponse,
        selection: {
          ...selectionEmptyResponse.selection,
          paymentMethod: selectionEmptyResponse.paymentMethods?.[0]?.paymentMethod,
        },
        paymentMethods: [
          {
            ...selectionEmptyResponse.paymentMethods?.[0],
            supportsInitiateOnly: true,
          },
        ],
      })

      const mockedResponseBody = {
        token: 'foo',
        action: 'success',
      }

      const mockedEvent = new CustomEvent('centra_checkout_payment_callback', {
        detail: {
          addressIncluded: true,
          billingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '',
            company: '',
            address1: '',
            address2: '',
            zipCode: '',
            city: '',
            state: '',
            country: '',
            vatNumber: '',
          },
          shippingAddress: {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phoneNumber: '',
            company: '',
            address1: '',
            address2: '',
            zipCode: '',
            city: '',
            state: '',
            country: '',
          },
        },
      })

      scope
        .post('/payment', (body) => {
          if (mockedEvent.detail.addressIncluded) {
            expect(body.address).toMatchObject(mockedEvent.detail.billingAddress)
            expect(body.shippingAddress).toMatchObject(mockedEvent.detail.shippingAddress)
          }

          return body.address.firstName
        })
        .reply(200, mockedResponseBody)

      scope.post('/payment').reply(200, {
        formHtml: '<div data-testid="injected-form">Injected form</div>',
      })

      const eventListeners: Array<[eventName: string, eventListener: EventListener]> = []

      vi.spyOn(document, 'addEventListener').mockImplementation((eventName, eventListener) => {
        if (typeof eventListener === 'function') {
          eventListeners.push([eventName, eventListener])
        }
      })

      render(<PaymentEmbed {...mockProps} />, { wrapper: CentraProviderWrapper })

      await waitFor(() => {
        expect(screen.getByTestId('injected-form')).toBeDefined()
      })

      const checkoutPaymentCallbackListeners = eventListeners.filter(
        ([name]) => name === 'centra_checkout_payment_callback',
      )

      checkoutPaymentCallbackListeners.forEach(([_, eventListener]) => eventListener(mockedEvent))

      await waitFor(() => {
        expect(mockProps.onPaymentSuccess).toHaveBeenCalledWith(mockedResponseBody)
      })
    })
  })
})
