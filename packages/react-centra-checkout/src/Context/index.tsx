import type * as CheckoutApi from '@noaignite/centra-types'
import type Cookies from 'js-cookie'
import cookies from 'js-cookie'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ApiClient from '../ApiClient'
import CentraEvents from '../internal/CentraEvents'

const defaultApiClient = ApiClient.default
const centraEvents = CentraEvents.default

/** The prop types that CentraProvider accepts */
export interface ProviderProps {
  /** Centra API URL */
  apiUrl?: string
  /** The api client to use instead of the default one */
  apiClient?: ApiClient
  children: React.ReactNode
  /** Disables automatic client side fetching of the Centra selection */
  disableInit?: boolean
  /** Sets the initial selection */
  initialSelection?: CheckoutApi.SuccessResponse<CheckoutApi.SelectionResponse>
  /** Used when submitting payment using the POST /payment Centra api call */
  paymentFailedPage: string
  /** Used when submitting payment using the POST /payment Centra api call */
  paymentReturnPage: string
  /** Receipt page to redirect to when Centra payment succeeds directly */
  receiptPage: string
  /**
    When the cookie used to store the Centra checkout token will expire, days as a number or a Date
    @defaultValue `365`
  */
  tokenExpires?: number | Date
  /**
    The name of the cookie used to store the Centra checkout token
    @defaultValue `centra-checkout-token`
  */
  tokenName?: string
  tokenCookieOptions?: Cookies.CookieAttributes
}

export interface ContextMethods {
  /**
    @param item - The Centra item id
  */
  addItem?: (
    item: string,
    quantity?: number,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param item - The Centra item id
    @param data - Bundle data
  */
  addBundleItem?: (
    item: string,
    data?: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param giftCertificate - The `giftCertificate` value of the gift certificate to add
  */
  addGiftCertificate?: (
    giftCertificate: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>

  addBackInStockSubscription?: (
    data: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param giftCertificate - The `giftCertificate` value of the gift certificate to add
    @param amount - Custom gift certificate amount
  */
  addCustomGiftCertificate?: (
    giftCertificate: string,
    amount: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>

  addNewsletterSubscription?: (
    data: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param voucher - The id of the voucher to add
  */
  addVoucher?: (voucher: string) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param line - The line id of the item to decrease
  */
  decreaseCartItem?: (line: string) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param line - The line id of the item to increase
  */
  increaseCartItem?: (line: string) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param selectionData - Initial selection data
  */
  init?: (selectionData?: CheckoutApi.Response<CheckoutApi.SelectionResponse>) => Promise<void>
  loginCustomer?: (
    email: string,
    password: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  logoutCustomer?: () => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param data - All data to register to customer. See {@link https://docs.centra.com/swagger-ui/?api=CheckoutAPI#/6.%20customer%20handling/post_register | Centra docs} for more details.
  */
  registerCustomer?: (
    data: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param line - The line id of the item to increase
  */
  removeCartItem?: (line: string) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param voucher - The id of the voucher to add
  */
  removeVoucher?: (voucher: string) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  /**
    @param i - The `i` query parameter provided by Centra when landing on the password reset page
    @param id - The `id` query parameter provided by Centra when landing on the password reset page
  */
  resetCustomerPassword?: (
    i: string,
    id: string,
    newPassword: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  resetSelection?: () => Promise<void>
  /**
    @param linkUri - URI of the password reset page. Should not be a full url e.g. `account/password-reset`. Domain is set in CheckoutApi.
  */
  sendCustomerResetPasswordEmail?: (
    email: string,
    linkUri: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  submitPayment?: (
    data: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.Payment>>
  updateCartItemQuantity?: (
    line: string,
    quantity: number,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateCartItemSize?: (
    cartItem: CheckoutApi.SelectionItem,
    item: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateCountry?: (
    country: string,
    data: { language: string },
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateCustomer?: (
    data: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateCustomerAddress?: (
    data: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateCustomerEmail?: (
    email: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateCustomerPassword?: (
    password: string,
    newPassword: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateLanguage?: (
    language: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updatePaymentFields?: (
    data: Record<string, unknown>,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updatePaymentMethod?: (
    paymentMethod: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateShippingMethod?: (
    shippingMethod: string,
  ) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
  updateCampaignSite?: (uri: string) => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
}

export type ContextProperties = CheckoutApi.SuccessResponse<CheckoutApi.SelectionResponse> & {
  apiUrl?: string
  apiClient?: ApiClient
}

export const SELECTION_INITIAL_VALUE: CheckoutApi.SelectionResponse = {
  countries: [],
  languages: [],
  location: {},
  paymentFields: {
    // @ts-expect-error -- TODO: Fix this
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

export const CentraHandlersContext = createContext<ContextMethods | null>(null)
const CentraSelectionContext = createContext<ContextProperties | null>(null)

/** React Context provider that is required to use the `useCentra` and `useCentraHandlers` hooks */
export function CentraProvider(props: ProviderProps) {
  const {
    apiClient: apiClientProp,
    apiUrl,
    children,
    disableInit = false,
    initialSelection,
    paymentFailedPage,
    paymentReturnPage,
    receiptPage,
    tokenExpires = 365,
    tokenName = 'centra-checkout-token',
    tokenCookieOptions = null,
  } = props

  const apiClient = apiClientProp ?? defaultApiClient

  const [selection, setSelection] = useState(initialSelection ?? SELECTION_INITIAL_VALUE)

  const centraCheckoutScript = 'selection' in selection && selection.selection?.centraCheckoutScript

  // set api client url
  if (apiUrl) {
    apiClient.baseUrl = apiUrl
  }

  // set api token if available
  if (initialSelection?.token) {
    apiClient.headers.set('api-token', initialSelection.token)
  }

  const selectionApiCall = useCallback(
    async (
      apiCall:
        | Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>
        | (() => Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>),
    ) => {
      window.CentraCheckout?.suspend()
      const response = typeof apiCall === 'function' ? await apiCall() : await apiCall

      if ('selection' in response && response.selection) {
        setSelection(response)
      }

      window.CentraCheckout?.resume()

      return response
    },
    [],
  )

  const centraCheckoutCallback = useCallback(
    async (event: CustomEvent) => {
      if (event.detail) {
        const response = await selectionApiCall(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- TODO: Fix this
          apiClient.request('PUT', `payment-fields`, event.detail),
        )

        centraEvents.dispatch('centra_checkout_callback', response)
      }
    },
    [apiClient, selectionApiCall],
  )

  const init = useCallback<NonNullable<ContextMethods['init']>>(
    async (selectionData) => {
      let response

      const apiToken = cookies.get(tokenName)
      if (apiToken) {
        apiClient.headers.set('api-token', apiToken)
      }

      if (!selectionData) {
        response = (await apiClient.request(
          'GET',
          'selection',
        )) as CheckoutApi.Response<CheckoutApi.SelectionResponse>
      } else {
        response = selectionData
      }

      if ('selection' in response && response.selection) {
        setSelection(response)

        if (response.token && response.token !== apiToken) {
          apiClient.headers.set('api-token', response.token)
          cookies.set(tokenName, response.token, { expires: tokenExpires, ...tokenCookieOptions })
        }
      }
    },
    [tokenName, apiClient, tokenExpires, tokenCookieOptions],
  )

  /* HANDLER METHODS */

  const addItem = useCallback<NonNullable<ContextMethods['addItem']>>(
    (item, quantity = 1) =>
      selectionApiCall(apiClient.request('POST', `items/${item}/quantity/${quantity}`)),
    [apiClient, selectionApiCall],
  )

  const addBundleItem = useCallback<NonNullable<ContextMethods['addBundleItem']>>(
    (item, data) => selectionApiCall(apiClient.request('POST', `items/bundles/${item}`, data)),
    [apiClient, selectionApiCall],
  )

  const addGiftCertificate = useCallback<NonNullable<ContextMethods['addGiftCertificate']>>(
    (giftCertificate) =>
      selectionApiCall(apiClient.request('POST', `items/gift-certificates/${giftCertificate}`)),
    [apiClient, selectionApiCall],
  )

  const addCustomGiftCertificate = useCallback<
    NonNullable<ContextMethods['addCustomGiftCertificate']>
  >(
    (giftCertificate, amount) =>
      selectionApiCall(
        apiClient.request('POST', `items/gift-certificates/${giftCertificate}/amount/${amount}`),
      ),
    [apiClient, selectionApiCall],
  )

  const increaseCartItem = useCallback<NonNullable<ContextMethods['increaseCartItem']>>(
    (line) => selectionApiCall(apiClient.request('POST', `lines/${line}/quantity/1`)),
    [apiClient, selectionApiCall],
  )

  const decreaseCartItem = useCallback<NonNullable<ContextMethods['decreaseCartItem']>>(
    (line) => selectionApiCall(apiClient.request('DELETE', `lines/${line}/quantity/1`)),
    [apiClient, selectionApiCall],
  )

  const removeCartItem = useCallback<NonNullable<ContextMethods['removeCartItem']>>(
    (line) => selectionApiCall(apiClient.request('DELETE', `lines/${line}`)),
    [apiClient, selectionApiCall],
  )

  const updateCartItemQuantity = useCallback<NonNullable<ContextMethods['updateCartItemQuantity']>>(
    (line, quantity) =>
      selectionApiCall(apiClient.request('PUT', `lines/${line}/quantity/${quantity}`)),
    [apiClient, selectionApiCall],
  )

  const updateCartItemSize = useCallback<NonNullable<ContextMethods['updateCartItemSize']>>(
    (cartItem, item) =>
      selectionApiCall(async () => {
        await apiClient.request('DELETE', `lines/${cartItem.line}`)

        const response = (await apiClient.request(
          'POST',
          `items/${item}/quantity/${cartItem.quantity}`,
        )) as Promise<CheckoutApi.Response<CheckoutApi.SelectionResponse>>

        return response
      }),
    [apiClient, selectionApiCall],
  )

  const addVoucher = useCallback<NonNullable<ContextMethods['addVoucher']>>(
    (voucher) => selectionApiCall(apiClient.request('POST', 'vouchers', { voucher })),
    [apiClient, selectionApiCall],
  )

  const removeVoucher = useCallback<NonNullable<ContextMethods['removeVoucher']>>(
    (voucher) => selectionApiCall(apiClient.request('DELETE', `vouchers/${voucher}`)),
    [apiClient, selectionApiCall],
  )

  const updateCountry = useCallback<NonNullable<ContextMethods['updateCountry']>>(
    (country, data) => selectionApiCall(apiClient.request('PUT', `countries/${country}`, data)),
    [apiClient, selectionApiCall],
  )

  const updateLanguage = useCallback<NonNullable<ContextMethods['updateLanguage']>>(
    (language) => selectionApiCall(apiClient.request('PUT', `languages/${language}`)),
    [apiClient, selectionApiCall],
  )

  const updateShippingMethod = useCallback<NonNullable<ContextMethods['updateShippingMethod']>>(
    (shippingMethod) =>
      selectionApiCall(apiClient.request('PUT', `shipping-methods/${shippingMethod}`)),
    [apiClient, selectionApiCall],
  )

  const updatePaymentMethod = useCallback<NonNullable<ContextMethods['updatePaymentMethod']>>(
    (paymentMethod) =>
      selectionApiCall(apiClient.request('PUT', `payment-methods/${paymentMethod}`)),
    [apiClient, selectionApiCall],
  )

  const updatePaymentFields = useCallback<NonNullable<ContextMethods['updatePaymentFields']>>(
    (data) => selectionApiCall(apiClient.request('PUT', `payment-fields`, data)),
    [apiClient, selectionApiCall],
  )

  const submitPayment = useCallback<NonNullable<ContextMethods['submitPayment']>>(
    async (data) => {
      const response = (await apiClient.request('POST', 'payment', {
        paymentReturnPage,
        paymentFailedPage,
        ...data,
      })) as CheckoutApi.Response<CheckoutApi.Payment>

      if ('errors' in response) {
        throw new Error(
          Object.entries(response.errors)
            .map((key, value) => `${key}: ${value}`)
            .join(','),
        )
      }

      // handle redirecting here
      switch (response.action) {
        case 'redirect':
          if (response.url) {
            window.location.href = response.url
          }
          break
        case 'success':
          // according to Centra docs – if action === 'success', user should be forwarded directly to the receipt page
          window.location.href = `${receiptPage}/${response.token}`
          break
        case 'javascript':
          if (response.code) {
            const script = document.createElement('script')
            const text = document.createTextNode(response.code)
            script.appendChild(text)
            document.body.appendChild(script)
          }
          break
        default:
          return response
      }
      return response
    },
    [apiClient, paymentFailedPage, paymentReturnPage, receiptPage],
  )

  const addBackInStockSubscription = useCallback<
    NonNullable<ContextMethods['addBackInStockSubscription']>
  >(
    (data) => selectionApiCall(apiClient.request('POST', 'back-in-stock-subscription', data)),
    [apiClient, selectionApiCall],
  )

  const addNewsletterSubscription = useCallback<
    NonNullable<ContextMethods['addNewsletterSubscription']>
  >(
    (data) => selectionApiCall(apiClient.request('POST', 'newsletter-subscription', data)),
    [apiClient, selectionApiCall],
  )

  const loginCustomer = useCallback<NonNullable<ContextMethods['loginCustomer']>>(
    (email, password) =>
      selectionApiCall(apiClient.request('POST', `login/${email}`, { password })),
    [apiClient, selectionApiCall],
  )

  const logoutCustomer = useCallback<NonNullable<ContextMethods['logoutCustomer']>>(
    () => selectionApiCall(apiClient.request('POST', `logout`)),
    [apiClient, selectionApiCall],
  )

  const registerCustomer = useCallback<NonNullable<ContextMethods['registerCustomer']>>(
    (data) => selectionApiCall(apiClient.request('POST', `register`, data)),
    [apiClient, selectionApiCall],
  )

  const resetCustomerPassword = useCallback<NonNullable<ContextMethods['resetCustomerPassword']>>(
    (i, id, newPassword) =>
      selectionApiCall(apiClient.request('POST', `password-reset`, { i, id, newPassword })),
    [apiClient, selectionApiCall],
  )

  /** Resets the selection. Useful if you need a fresh `api-token` (when a user exits a campaign site, for example). */
  const resetSelection = useCallback<NonNullable<ContextMethods['resetSelection']>>(() => {
    apiClient.headers.delete('api-token')
    cookies.remove(tokenName)

    return init()
  }, [apiClient.headers, init, tokenName])

  const sendCustomerResetPasswordEmail = useCallback<
    NonNullable<ContextMethods['sendCustomerResetPasswordEmail']>
  >(
    (email, linkUri) =>
      selectionApiCall(apiClient.request('POST', `password-reset-email/${email}`, { linkUri })),
    [apiClient, selectionApiCall],
  )

  const updateCustomer = useCallback<NonNullable<ContextMethods['updateCustomer']>>(
    (data) => selectionApiCall(apiClient.request('PUT', `customer/update`, data)),
    [apiClient, selectionApiCall],
  )

  const updateCustomerAddress = useCallback<NonNullable<ContextMethods['updateCustomerAddress']>>(
    (data) => selectionApiCall(apiClient.request('PUT', `address`, data)),
    [apiClient, selectionApiCall],
  )

  const updateCustomerEmail = useCallback<NonNullable<ContextMethods['updateCustomerEmail']>>(
    (newEmail) => selectionApiCall(apiClient.request('PUT', `email`, { newEmail })),
    [apiClient, selectionApiCall],
  )

  const updateCustomerPassword = useCallback<NonNullable<ContextMethods['updateCustomerPassword']>>(
    (password, newPassword) =>
      selectionApiCall(apiClient.request('PUT', `password`, { password, newPassword })),
    [apiClient, selectionApiCall],
  )

  const updateCampaignSite = useCallback<NonNullable<ContextMethods['updateCampaignSite']>>(
    (uri) => selectionApiCall(apiClient.request('PUT', `campaign-site`, { uri })),
    [apiClient, selectionApiCall],
  )

  /* EFFECTS */

  useEffect(() => {
    if (!disableInit) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO: FIx this
      init()
    }

    // always add event listener for centra_checkout_callback in case it is used
    // @ts-expect-error -- TODO: Fix this
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- TODO: Fix this
    document.addEventListener('centra_checkout_callback', centraCheckoutCallback)

    return () => {
      // @ts-expect-error -- TODO: Fix this
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- TODO: Fix this
      document.removeEventListener('centra_checkout_callback', centraCheckoutCallback)
    }
  }, [disableInit, init, centraCheckoutCallback])

  // run centra checkout script if it is available in the selection
  useEffect(() => {
    let script: HTMLScriptElement | null = null
    if (centraCheckoutScript) {
      script = document.createElement('script')
      script.innerHTML = centraCheckoutScript
      script.id = 'centra-checkout-script'
      document.head.appendChild(script)
    }

    return () => {
      if (script) {
        document.head.removeChild(script)
      }
    }
  }, [centraCheckoutScript])

  const centraHandlersContext = useMemo<ContextMethods>(
    (): ContextMethods => ({
      addItem,
      addBundleItem,
      addGiftCertificate,
      addBackInStockSubscription,
      addCustomGiftCertificate,
      addNewsletterSubscription,
      addVoucher,
      decreaseCartItem,
      increaseCartItem,
      init,
      loginCustomer,
      logoutCustomer,
      registerCustomer,
      removeCartItem,
      removeVoucher,
      resetCustomerPassword,
      resetSelection,
      sendCustomerResetPasswordEmail,
      submitPayment,
      updateCartItemQuantity,
      updateCartItemSize,
      updateCountry,
      updateCustomer,
      updateCustomerAddress,
      updateCustomerEmail,
      updateCustomerPassword,
      updateLanguage,
      updatePaymentFields,
      updatePaymentMethod,
      updateShippingMethod,
      updateCampaignSite,
    }),
    [
      addItem,
      addBundleItem,
      addGiftCertificate,
      addBackInStockSubscription,
      addCustomGiftCertificate,
      addNewsletterSubscription,
      addVoucher,
      decreaseCartItem,
      increaseCartItem,
      init,
      loginCustomer,
      logoutCustomer,
      registerCustomer,
      removeCartItem,
      removeVoucher,
      resetCustomerPassword,
      resetSelection,
      sendCustomerResetPasswordEmail,
      submitPayment,
      updateCartItemQuantity,
      updateCartItemSize,
      updateCountry,
      updateCustomer,
      updateCustomerAddress,
      updateCustomerEmail,
      updateCustomerPassword,
      updateLanguage,
      updatePaymentFields,
      updatePaymentMethod,
      updateShippingMethod,
      updateCampaignSite,
    ],
  )

  const centraContext = useMemo(
    (): ContextProperties => ({
      ...selection,
      apiUrl,
      apiClient,
    }),
    [selection, apiUrl, apiClient],
  )

  return (
    <CentraHandlersContext.Provider value={centraHandlersContext}>
      <CentraSelectionContext.Provider value={centraContext}>
        {children}
      </CentraSelectionContext.Provider>
    </CentraHandlersContext.Provider>
  )
}

/** This hook returns the centra selection */
export function useCentraSelection() {
  const context = useContext(CentraSelectionContext)

  if (context === null) {
    throw new Error(
      [
        '@noaignite/react-centra-checkout: `useCentraSelection` may only be',
        'used inside the `CentraProvider` react tree, please declare it at a',
        'higher level.',
      ].join(' '),
    )
  }

  return context
}

/** This hook returns update handlers */
export function useCentraHandlers() {
  const context = useContext(CentraHandlersContext)

  if (context === null) {
    throw new Error(
      [
        '@noaignite/react-centra-checkout: `useCentraHandlers` may only be',
        'used inside the `CentraProvider` react tree, please declare it at a',
        'higher level.',
      ].join(' '),
    )
  }

  return context
}

/** Returns the latest order receipt given a selection token */
export function useCentraReceipt(
  token: string,
): CheckoutApi.Response<CheckoutApi.OrderCompleteResponse> {
  const [result, setResult] = useState<CheckoutApi.Response<CheckoutApi.OrderCompleteResponse>>({})
  const { apiUrl } = useCentraSelection()

  if (!token) {
    console.error('@noaignite/react-centra-checkout: useReceipt requires a selection id')
  }

  useEffect(() => {
    // create a new ApiClient in order to temporarily use a different token
    const tempApiClient = new ApiClient(apiUrl)
    tempApiClient.headers.set('api-token', token)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO: Fix this
    tempApiClient.request('GET', 'receipt').then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- TODO: Fix this
      setResult(response)
    })
  }, [apiUrl, token])

  return result
}

/** Returns the latest orders for the currently logged in user
  @param from - Display orders from this index. Defaults to 0.
  @param size - Display this many orders. Defaults lists all orders.
*/
export function useCentraOrders(
  from?: number,
  size?: number,
  apiClient = defaultApiClient,
): CheckoutApi.Response<CheckoutApi.OrdersResponse> {
  const [result, setResult] = useState<CheckoutApi.Response<CheckoutApi.OrdersResponse>>({})

  useEffect(() => {
    // fetch orders
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO: Fix this
    apiClient
      .request('POST', 'orders', {
        ...(from && { from }),
        ...(size && { size }),
      })
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- TODO: Fix this
        setResult(response)
      })
  }, [apiClient, from, size])

  return result
}

export function useCentraEvents() {
  return CentraEvents.default
}

export default CentraSelectionContext
