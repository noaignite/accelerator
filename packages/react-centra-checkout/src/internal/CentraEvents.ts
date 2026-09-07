import type * as CentraCheckoutApi from '@noaignite/centra-types'
import type { ContextMethods, useCentraOrders, useCentraReceipt } from '../Context'

export const CENTRA_EVENTS = [
  'centra_checkout_callback',
  'centra_checkout_payment_callback',
] satisfies Array<keyof GlobalEventHandlersEventMap>

export const HANDLER_EVENTS = [
  'addItem',
  'addBundleItem',
  'addGiftCertificate',
  'addBackInStockSubscription',
  'addCustomGiftCertificate',
  'addNewsletterSubscription',
  'addVoucher',
  'decreaseCartItem',
  'increaseCartItem',
  'init',
  'loginCustomer',
  'logoutCustomer',
  'registerCustomer',
  'removeCartItem',
  'removeVoucher',
  'resetCustomerPassword',
  'resetSelection',
  'sendCustomerResetPasswordEmail',
  'submitPayment',
  'updateCartItemQuantity',
  'updateCartItemSize',
  'updateCountry',
  'updateCustomer',
  'updateCustomerAddress',
  'updateCustomerEmail',
  'updateCustomerPassword',
  'updateLanguage',
  'updatePaymentFields',
  'updatePaymentMethod',
  'updateShippingMethod',
  'updateCampaignSite',
] as const satisfies readonly (keyof ContextMethods)[]

type Hooks = {
  useCentraOrders: typeof useCentraOrders
  useCentraReceipt: typeof useCentraReceipt
}

export const HOOK_EVENTS = ['useCentraReceipt', 'useCentraOrders'] as const satisfies Array<
  keyof Hooks
>

export const EVENTS = [...CENTRA_EVENTS, ...HANDLER_EVENTS, ...HOOK_EVENTS] as const

export type EventName = (typeof EVENTS)[number]
export type StaticEventName = (typeof CENTRA_EVENTS)[number]
export type HandlerEventName = (typeof HANDLER_EVENTS)[number]
export type HookEventName = (typeof HOOK_EVENTS)[number]

type EventPayload = CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>

export type StaticEventArguments = {
  [K in StaticEventName]: [payload: EventPayload]
}

export type HandlerEventArguments = {
  [K in HandlerEventName]: [
    payload: EventPayload,
    ...handlerArgs: Parameters<NonNullable<ContextMethods[K]>>,
  ]
}

export type HookEventArguments = {
  [K in HookEventName]: [ReturnType<Hooks[K]>]
}

export type EventArguments = StaticEventArguments & HandlerEventArguments & HookEventArguments
export type EventCallback<K extends EventName> = (...args: EventArguments[K]) => unknown
export type StaticEventCallback<K extends StaticEventName> = EventCallback<K>
export type HandlerEventCallback<K extends HandlerEventName> = EventCallback<K>
export type HookEventCallback<K extends HookEventName> = EventCallback<K>
export type AnyEventCallback = EventCallback<EventName>

function isValidEvent(eventName: EventName | string) {
  if (EVENTS.includes(eventName as EventName)) {
    return true
  }

  console.error(`@noaignite/react-centra-checkout: There's no event with the name ${eventName}`)
  return false
}

export class CentraEvents {
  eventHandlers: Partial<Record<EventName, Set<AnyEventCallback>>>

  private static _default?: CentraEvents

  constructor() {
    this.eventHandlers = Object.fromEntries(EVENTS.map((eventName) => [eventName, new Set()]))
  }

  on<K extends EventName>(eventName: K, callback: EventCallback<K>) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.add(callback as AnyEventCallback)

      return true
    }

    return false
  }

  off<K extends EventName>(eventName: K, callback: EventCallback<K>) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.delete(callback as AnyEventCallback)

      return true
    }

    return false
  }

  dispatch<K extends EventName>(eventName: K, ...args: EventArguments[K]) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.forEach((handler) => {
        ;(handler as EventCallback<K>)(...args)
      })
    }
  }

  public static get default(): CentraEvents {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- TODO: Remove rule disable when appropriate
    if (!CentraEvents._default) {
      CentraEvents._default = new CentraEvents()
    }

    return CentraEvents._default
  }

  public get default(): CentraEvents {
    return CentraEvents.default
  }
}
