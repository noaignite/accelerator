import * as React from 'react'
import * as Centra from '@noaignite/centra-types'
import ApiClient from '../ApiClient'

const apiClient = ApiClient.default

/** The prop types that CentraProvider accepts */
export interface ProviderProps {
  apiUrl: string
  children: React.ReactNode
  disableInitialSelection?: boolean
  paymentFailedPage: string
  paymentReturnPage: string
}

export interface ContextMethods {
  addItem?(item: string, quantity?: number): Promise<Response>
  addNewsletterSubscription?(email: string): Promise<Response>
  addVoucher?(voucher: string): Promise<Response>
  decreaseCartItem?(line: string): Promise<Response>
  increaseCartItem?(line: string): Promise<Response>
  init?(selectionData?: Centra.SelectionResponseExtended): Promise<void>
  removeCartItem?(line: string): Promise<Response>
  removeVoucher?(voucher: string): Promise<Response>
  submitPayment?(data: Record<string, unknown>, locale?: string): Promise<Centra.PaymentResponse>
  updateCountry?(country: string, data: { language: string }): Promise<Response>
  updateCartItemQuantity?(line: string, quantity: number): Promise<Response>
  updateCartItemSize?(cartItem: Centra.SelectionItemModel, item: string): Promise<Response>
  updateLanguage?(language: string): Promise<Response>
  updatePaymentMethod?(paymentMethod: string): Promise<Response>
  updateShippingMethod?(shippingMethod: string): Promise<Response>
}

export interface ContextProperties extends ContextMethods, Centra.SelectionResponseExtended {
  apiUrl?: string
  apiClient?: ApiClient
}

const DEFAULT_VALUE = {
  countries: [],
  languages: [],
  location: {},
  paymentFields: {
    address: {},
    shippingAddress: {},
    termsAndConditions: {},
  },
  paymentMethods: [],
  selection: {
    address: {},
    discounts: {},
    items: [],
    totals: {},
  },
  shippingMethods: [],
}

const HandlersContext = React.createContext<ContextMethods>({})
const Context = React.createContext<ContextProperties>({})

/** React Context provider that is required to use the `useCentra` and `useCentraHandlers` hooks */
export function CentraProvider(props: ProviderProps) {
  const {
    apiUrl,
    children,
    disableInitialSelection = false,
    paymentFailedPage,
    paymentReturnPage,
  } = props

  const [selection, setSelection] = React.useState<Centra.SelectionResponseExtended>(DEFAULT_VALUE)

  // set api client url
  apiClient.baseUrl = apiUrl

  const centraCheckoutCallback = React.useCallback(async (event) => {
    if (event.detail) {
      const response = (await apiClient.request(
        'PUT',
        'payment-fields',
        event.detail,
      )) as Centra.SelectionResponseExtended
      setSelection(response)
    }
  }, [])

  const selectionApiCall = React.useCallback(async (apiCall) => {
    window.CentraCheckout?.suspend()
    const response = await apiCall

    if (response && response.selection) {
      setSelection(response)
    }

    window.CentraCheckout?.resume()

    return response
  }, [])

  const init = React.useCallback<NonNullable<ContextMethods['init']>>(async (selectionData) => {
    let response
    if (!selectionData) {
      response = (await apiClient.request('GET', 'selection')) as Centra.SelectionResponseExtended
    } else {
      response = selectionData
    }

    if (response && response.selection) {
      setSelection(response)

      const clientToken = window.localStorage.getItem('checkoutToken')

      if (response.token && response.token !== clientToken) {
        apiClient.headers.set('api-token', response.token)
        window.localStorage.setItem('checkoutToken', response.token)
      } else if (clientToken) {
        apiClient.headers.set('api-token', clientToken)
      }
    }
  }, [])

  /* HANDLER METHODS */

  const addItem = React.useCallback<NonNullable<ContextMethods['addItem']>>(
    (item, quantity = 1) =>
      selectionApiCall(apiClient.request('POST', `items/${item}/quantity/${quantity}`)),
    [selectionApiCall],
  )

  const increaseCartItem = React.useCallback<NonNullable<ContextMethods['increaseCartItem']>>(
    (line) => selectionApiCall(apiClient.request('POST', `lines/${line}/quantity/1`)),
    [selectionApiCall],
  )

  const decreaseCartItem = React.useCallback<NonNullable<ContextMethods['decreaseCartItem']>>(
    (line) => selectionApiCall(apiClient.request('DELETE', `lines/${line}/quantity/1`)),
    [selectionApiCall],
  )

  const removeCartItem = React.useCallback<NonNullable<ContextMethods['removeCartItem']>>(
    (line) => selectionApiCall(apiClient.request('DELETE', `lines/${line}`)),
    [selectionApiCall],
  )

  const updateCartItemQuantity = React.useCallback<
    NonNullable<ContextMethods['updateCartItemQuantity']>
  >(
    (line, quantity) =>
      selectionApiCall(apiClient.request('PUT', `lines/${line}/quantity/${quantity}`)),
    [selectionApiCall],
  )

  const updateCartItemSize = React.useCallback<NonNullable<ContextMethods['updateCartItemSize']>>(
    (cartItem, item) =>
      selectionApiCall(async () => {
        await apiClient.request('DELETE', `lines/${cartItem.line}`)

        const response = await apiClient.request(
          'POST',
          `items/${item}/quantity/${cartItem.quantity}`,
        )

        return response
      }),
    [selectionApiCall],
  )

  const addVoucher = React.useCallback<NonNullable<ContextMethods['addVoucher']>>(
    (voucher) => selectionApiCall(apiClient.request('POST', 'vouchers', { voucher })),
    [selectionApiCall],
  )

  const removeVoucher = React.useCallback<NonNullable<ContextMethods['removeVoucher']>>(
    (voucher) => selectionApiCall(apiClient.request('DELETE', `vouchers/${voucher}`)),
    [selectionApiCall],
  )

  const updateCountry = React.useCallback<NonNullable<ContextMethods['updateCountry']>>(
    (country, data) => selectionApiCall(apiClient.request('PUT', `countries/${country}`, data)),
    [selectionApiCall],
  )

  const updateLanguage = React.useCallback<NonNullable<ContextMethods['updateLanguage']>>(
    (language) => selectionApiCall(apiClient.request('PUT', `languages/${language}`)),
    [selectionApiCall],
  )

  const updateShippingMethod = React.useCallback<
    NonNullable<ContextMethods['updateShippingMethod']>
  >(
    (shippingMethod) =>
      selectionApiCall(apiClient.request('PUT', `shipping-methods/${shippingMethod}`)),
    [selectionApiCall],
  )

  const updatePaymentMethod = React.useCallback<NonNullable<ContextMethods['updatePaymentMethod']>>(
    (paymentMethod) =>
      selectionApiCall(apiClient.request('PUT', `payment-methods/${paymentMethod}`)),
    [selectionApiCall],
  )

  const submitPayment = React.useCallback<NonNullable<ContextMethods['submitPayment']>>(
    async (data, locale) => {
      const param = locale ? `?lang=${locale}` : ''

      const response = (await apiClient.request('POST', 'payment', {
        paymentReturnPage: `${paymentReturnPage}/${selection.token}${param}`,
        paymentFailedPage: `${paymentFailedPage}/${selection.token}${param}`,
        ...data,
      })) as Centra.PaymentResponse

      // handle redirecting here
      switch (response.action) {
        case 'redirect':
          if (response.url) {
            window.location.href = response.url
          }
          break
        case 'success':
          window.location.href = `${paymentReturnPage}/${selection.token}${param}`
          break
        default:
          return response
      }
      return response
    },
    [paymentFailedPage, paymentReturnPage, selection.token],
  )

  const addNewsletterSubscription = React.useCallback<
    NonNullable<ContextMethods['addNewsletterSubscription']>
  >(
    (email) => selectionApiCall(apiClient.request('POST', 'newsletter-subscription', { email })),
    [selectionApiCall],
  )

  /* EFFECTS */

  React.useEffect(() => {
    if (!disableInitialSelection) {
      init()
    }

    // always add event listener for centra_checkout_callback in case it is used
    document.addEventListener('centra_checkout_callback', centraCheckoutCallback)

    return () => {
      document.removeEventListener('centra_checkout_callback', centraCheckoutCallback)
    }
  }, [disableInitialSelection, init, centraCheckoutCallback])

  // run centra checkout script if it is available in the selection
  React.useEffect(() => {
    let script: HTMLScriptElement | null = null
    if (selection?.selection?.centraCheckoutScript) {
      script = document.createElement('script')
      script.innerHTML = selection.selection.centraCheckoutScript
      script.id = 'centra-checkout-script'
      document.head.appendChild(script)
    }

    return () => {
      if (script) {
        document.head.removeChild(script)
      }
    }
  }, [selection])

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
      apiUrl,
      apiClient,
    }),
    [centraHandlersContext, selection, apiUrl],
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
export function useCentraSelection(): Centra.SelectionModel {
  return React.useContext(Context).selection ?? DEFAULT_VALUE.selection
}

/** This hook only returns update handlers and should be used when you don't need to subscribe to
centra selection updates */
export function useCentraHandlers(): ContextMethods {
  return React.useContext(HandlersContext)
}

/** Returns the latest order receipt given a selection token */
export function useCentraReceipt(token: string): Centra.OrderCompleteResponse | null {
  const [receipt, setReceipt] = React.useState(null)
  const { apiUrl } = useCentra()

  if (!token) {
    console.error('@noaignite/react-centra-checkout: useReceipt requires a selection id')
  }

  React.useEffect(() => {
    // create a new ApiClient in order to temporarily use a different token
    const tempApiClient = new ApiClient(apiUrl)
    tempApiClient.headers.set('api-token', token)

    tempApiClient.request('GET', 'receipt').then((response) => {
      if (response.order) {
        setReceipt(response.order)
      }
    })
  }, [apiUrl, token])

  return receipt
}

export default Context
