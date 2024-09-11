/* eslint-disable camelcase -- Allow */

import type * as CentraCheckoutApi from '@noaignite/centra-types'

const CENTRA_EVENTS = ['centra_checkout_callback', 'centra_checkout_payment_callback'] as const

function isValidEvent(eventName: (typeof CENTRA_EVENTS)[number]) {
  if (CENTRA_EVENTS.includes(eventName)) {
    return true
  }

  console.error(`@noaignite/react-centra-checkout: There's no event with the name ${eventName}`)
  return false
}

class CentraEvents {
  eventHandlers: {
    centra_checkout_callback?: Set<
      (payload: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>) => unknown
    >
    centra_checkout_payment_callback?: Set<
      (payload: CentraCheckoutApi.SelectionResponse) => unknown
    >
  }

  private static _default?: CentraEvents

  constructor() {
    this.eventHandlers = {
      centra_checkout_callback: new Set(),
      centra_checkout_payment_callback: new Set(),
    }
  }

  on(
    eventName: (typeof CENTRA_EVENTS)[number],
    callback: (
      response: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>,
    ) => unknown,
  ) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.add(callback)

      return true
    }

    return false
  }

  off(
    eventName: (typeof CENTRA_EVENTS)[number],
    callback: (
      response: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>,
    ) => unknown,
  ) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.delete(callback)

      return true
    }

    return false
  }

  dispatch(
    eventName: (typeof CENTRA_EVENTS)[number],
    payload: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>,
  ) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.forEach((handler) => handler(payload))
    }
  }

  public static get default(): CentraEvents {
    if (!CentraEvents._default) {
      CentraEvents._default = new CentraEvents()
    }

    return CentraEvents._default
  }

  public get default(): CentraEvents {
    return CentraEvents.default
  }
}

export default CentraEvents
