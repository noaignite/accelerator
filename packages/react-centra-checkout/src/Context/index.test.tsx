import { selectionEmptyResponse, selectionResponse } from '@noaignite/centra-mocks'
import type * as CheckoutApi from '@noaignite/centra-types'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import nock from 'nock'
import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'
import { CentraProvider, useCentraHandlers, useCentraSelection } from '.'

const CENTRA_API_URL = 'https://mock-centra-checkout.com/api'
const TEST_ITEM = '370-261'

nock(CENTRA_API_URL)
  .persist()
  .get('/selection')
  .reply(200, selectionEmptyResponse)

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

  it('Adds one item', async () => {
    nock(CENTRA_API_URL)
      .post(`/items/${TEST_ITEM}/quantity/1`)
      .reply(200, selectionResponse)

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
    nock(CENTRA_API_URL).post(`/items/${TEST_ITEM}/quantity/2`)
      .reply(200, () => ({
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
})
