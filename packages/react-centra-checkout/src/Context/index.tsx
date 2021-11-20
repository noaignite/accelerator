import * as React from 'react'
import ApiClient from '../ApiClient'
import { SelectionResponse, SelectionItemModel, SelectionModel } from '../types/centra.types'

export interface ProviderProps {
  apiUrl: string
  children: React.ReactNode
  disableInitialSelection: boolean
  paymentFailedPage: string
  paymentReturnPage: string
}

export interface ContextMethods {
  addItem?(item: string, quantity?: number): Promise<Response>
  addNewsletterSubscription?(email: string): Promise<Response>
  addVoucher?(voucher: string): Promise<Response>
  decreaseCartItem?(line: string): Promise<Response>
  increaseCartItem?(line: string): Promise<Response>
  init?(selectionData?: SelectionResponse): Promise<void>
  removeCartItem?(line: string): Promise<Response>
  removeVoucher?(voucher: string): Promise<Response>
  submitPayment?(data: Record<string, unknown>, locale: string): Promise<Record<string, unknown>>
  updateCountry?(country: string, data: { language: string }): Promise<Response>
  updateCartItemQuantity?(line: string, quantity: number): Promise<Response>
  updateCartItemSize?(cartItem: SelectionItemModel, item: string): Promise<Response>
  updateLanguage?(language: string): Promise<Response>
  updatePaymentMethod?(paymentMethod: string): Promise<Response>
  updateShippingMethod?(shippingMethod: string): Promise<Response>
}

export interface ContextProperties extends ContextMethods, SelectionResponse {}

const INITIAL_SELECTION = {}
const HandlersContext = React.createContext<ContextMethods>({})
const Context = React.createContext<ContextProperties>({})

/** React Context provider that is required to use the `useCentra` and `useCentraHandlers` hooks */
export function CentraProvider(props: ProviderProps) {
  const {
    children,
    apiUrl,
    paymentReturnPage,
    paymentFailedPage,
    disableInitialSelection = false,
  } = props

  const [selection, setSelection] = React.useState<SelectionResponse>(INITIAL_SELECTION)

  const { current: apiClient } = React.useRef(new ApiClient(apiUrl))

  const centraCheckoutCallback = React.useCallback(
    async (event) => {
      if (event.detail) {
        const response = (await apiClient.request(
          'PUT',
          'payment-fields',
          event.detail,
        )) as SelectionResponse
        setSelection(response)
      }
    },
    [apiClient],
  )

  const selectionApiCall = React.useCallback(async (apiCall) => {
    window.CentraCheckout?.suspend()
    const response = await apiCall

    if (response && response.selection) {
      setSelection(response)
    }

    window.CentraCheckout?.resume()

    return response
  }, [])

  const init = React.useCallback(
    async (selectionData?: SelectionResponse) => {
      let response
      if (!selectionData) {
        response = (await apiClient.request('GET', 'selection')) as SelectionResponse
      } else {
        response = selectionData
      }

      if (response && response.selection) {
        setSelection(response)

        if (response.token && response.token !== window.localStorage.getItem('checkoutToken')) {
          apiClient.token = response.token
          window.localStorage.setItem('checkoutToken', response.token)
        }
      }
    },
    [apiClient],
  )

  React.useEffect(() => {
    if (!disableInitialSelection) {
      init()
    }

    document.addEventListener('centra_checkout_callback', centraCheckoutCallback)

    return () => {
      document.removeEventListener('centra_checkout_callback', centraCheckoutCallback)
    }
  }, [disableInitialSelection, init, centraCheckoutCallback])

  const addItem = React.useCallback(
    (item: string, quantity: number) =>
      selectionApiCall(apiClient.request('POST', `items/${item}/quantity/${quantity}`)),
    [selectionApiCall, apiClient],
  )

  const increaseCartItem = React.useCallback(
    (line: string) => selectionApiCall(apiClient.request('POST', `lines/${line}/quantity/1`)),
    [selectionApiCall, apiClient],
  )

  const decreaseCartItem = React.useCallback(
    (line: string) => selectionApiCall(apiClient.request('DELETE', `lines/${line}/quantity/1`)),
    [selectionApiCall, apiClient],
  )

  const removeCartItem = React.useCallback(
    (line: string) => selectionApiCall(apiClient.request('DELETE', `lines/${line}`)),
    [selectionApiCall, apiClient],
  )

  const updateCartItemQuantity = React.useCallback(
    (line: string, quantity: number) =>
      selectionApiCall(apiClient.request('PUT', `lines/${line}/quantity/${quantity}`)),
    [selectionApiCall, apiClient],
  )

  const updateCartItemSize = React.useCallback(
    (cartItem, item: string) =>
      selectionApiCall(async () => {
        await apiClient.request('DELETE', `lines/${cartItem.line}`)

        const response = await apiClient.request(
          'POST',
          `items/${item}/quantity/${cartItem.quantity}`,
        )

        return response
      }),
    [selectionApiCall, apiClient],
  )

  const addVoucher = React.useCallback(
    (voucher: string) => selectionApiCall(apiClient.request('POST', 'vouchers', { voucher })),
    [selectionApiCall, apiClient],
  )

  const removeVoucher = React.useCallback(
    (voucher: string) => selectionApiCall(apiClient.request('DELETE', `vouchers/${voucher}`)),
    [selectionApiCall, apiClient],
  )

  const updateCountry = React.useCallback(
    (country: string, data: { language: string }) =>
      selectionApiCall(apiClient.request('PUT', `countries/${country}`, data)),
    [selectionApiCall, apiClient],
  )

  const updateLanguage = React.useCallback(
    (language: string) => selectionApiCall(apiClient.request('PUT', `languages/${language}`)),
    [selectionApiCall, apiClient],
  )

  const updateShippingMethod = React.useCallback(
    (shippingMethod: string) =>
      selectionApiCall(apiClient.request('PUT', `shipping-methods/${shippingMethod}`)),
    [selectionApiCall, apiClient],
  )

  const updatePaymentMethod = React.useCallback(
    (paymentMethod: string) =>
      selectionApiCall(apiClient.request('PUT', `payment-methods/${paymentMethod}`)),
    [selectionApiCall, apiClient],
  )

  const submitPayment = React.useCallback(
    async (data: Record<string, unknown>, locale: string) => {
      const param = locale ? `?lang=${locale}` : ''

      const response = await apiClient.request('POST', 'payment', {
        paymentReturnPage: `${paymentReturnPage}/${selection.token}${param}`,
        paymentFailedPage: `${paymentFailedPage}/${selection.token}${param}`,
        termsAndConditions: true,
        ...data,
      })

      return response
    },
    [selection.token, apiClient, paymentReturnPage, paymentFailedPage],
  )

  const addNewsletterSubscription = React.useCallback(
    (email: string) =>
      selectionApiCall(apiClient.request('POST', 'newsletter-subscription', { email })),
    [selectionApiCall, apiClient],
  )

  const centraHandlersContext = React.useMemo<ContextMethods>(
    (): ContextMethods => ({
      addItem,
      addNewsletterSubscription,
      addVoucher,
      decreaseCartItem,
      increaseCartItem,
      init,
      removeCartItem,
      removeVoucher,
      submitPayment,
      updateCartItemQuantity,
      updateCartItemSize,
      updateCountry,
      updateLanguage,
      updatePaymentMethod,
      updateShippingMethod,
    }),
    [
      addItem,
      addNewsletterSubscription,
      addVoucher,
      decreaseCartItem,
      increaseCartItem,
      init,
      removeCartItem,
      removeVoucher,
      submitPayment,
      updateCartItemQuantity,
      updateCartItemSize,
      updateCountry,
      updateLanguage,
      updatePaymentMethod,
      updateShippingMethod,
    ],
  )

  const centraContext = React.useMemo(
    (): ContextProperties => ({
      ...selection,
      ...centraHandlersContext,
    }),
    [centraHandlersContext, selection],
  )

  return (
    <HandlersContext.Provider value={centraHandlersContext}>
      <Context.Provider value={centraContext}>{children}</Context.Provider>
    </HandlersContext.Provider>
  )
}

/** This hook returns update handlers and centra selection */
export function useCentra(): ContextProperties {
  return React.useContext(Context)
}

/** This hook only returns the centra selection */
export function useCentraSelection(): SelectionModel {
  return React.useContext(Context).selection ?? INITIAL_SELECTION
}

/** This hook only returns update handlers and should be used when you don't need to subscribe to
centra selection updates */
export function useCentraHandlers(): ContextMethods {
  return React.useContext(HandlersContext)
}

export default Context
