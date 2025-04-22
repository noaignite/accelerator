import { selectionEmptyResponse, selectionResponse } from '@noaignite/centra-mocks'
import { render, waitFor } from '@testing-library/react'
import nock from 'nock'
import { describe, expect, it, vi } from 'vitest'
import { CentraProvider } from './Context'
import { ShipwalletEmbed } from './ShipwalletEmbed'

const CENTRA_API_URL = 'https://mock-centra-checkout.com/api'

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

function TestComponent() {
  return <ShipwalletEmbed />
}

describe('ShipwalletEmbed', () => {
  it('re-initiates shipwallet on mount', async () => {
    const centraCheckoutStub = {
      reInitiate: vi.fn(),
    }

    vi.stubGlobal('CentraCheckout', centraCheckoutStub)

    nock(CENTRA_API_URL).get('/selection').reply(200, selectionEmptyResponse)

    render(<TestComponent />, { wrapper: CentraProviderWrapper })

    await waitFor(() => {
      expect(centraCheckoutStub.reInitiate).toHaveBeenCalledWith('shipwallet')
    })
  })

  it('only renders if shipwallet is available on selection', async () => {
    nock(CENTRA_API_URL).get('/selection').reply(200, selectionEmptyResponse)

    const { container: containerThatShouldBeEmpty } = render(<TestComponent />, {
      wrapper: CentraProviderWrapper,
    })

    await waitFor(() => {
      expect(containerThatShouldBeEmpty.innerHTML).toBe('')
    })

    const shipwalletSnippet = '<div id="shipwallet-snippet">foobar</div>'

    nock(CENTRA_API_URL)
      .get('/selection')
      .reply(200, {
        ...selectionResponse,
        selection: {
          ...selectionResponse.selection,
          pluginFields: {
            ...selectionResponse.selection?.pluginFields,
            shipwallet: {
              snippet: shipwalletSnippet,
            },
          },
        },
      })

    const { container: containerWithChild } = render(<TestComponent />, {
      wrapper: CentraProviderWrapper,
    })

    await waitFor(() => {
      expect(containerWithChild.innerHTML).not.toBe('')
    })
  })
})
