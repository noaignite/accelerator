import * as CentraCheckoutApi from '@noaignite/centra-types';

const CENTRA_EVENTS = ['centra_checkout_callback', 'centra_checkout_payment_callback'] as [
  'centra_checkout_callback',
  'centra_checkout_payment_callback',
];

function isValidEvent(eventName: (typeof CENTRA_EVENTS)[number]) {
  if (CENTRA_EVENTS.includes(eventName)) {
    return true;
  }

  console.error(`@noaignite/react-centra-checkout: There's no event with the name ${eventName}`);
  return false;
}

class CentraEvents {
  eventHandlers: {
    centra_checkout_callback?: Set<
      (payload: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>) => unknown
    >;
    centra_checkout_payment_callback?: Set<
      (payload: CentraCheckoutApi.SelectionResponse) => unknown
    >;
  };

  static default: CentraEvents;

  constructor() {
    this.eventHandlers = {
      centra_checkout_callback: new Set(),
      centra_checkout_payment_callback: new Set(),
    };
  }

  on(
    eventName: (typeof CENTRA_EVENTS)[number],
    callback: (
      response: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>,
    ) => unknown,
  ) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.add(callback);

      return true;
    }

    return false;
  }

  off(
    eventName: (typeof CENTRA_EVENTS)[number],
    callback: (
      response: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>,
    ) => unknown,
  ) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.delete(callback);

      return true;
    }

    return false;
  }

  dispatch(
    eventName: (typeof CENTRA_EVENTS)[number],
    payload: CentraCheckoutApi.Response<CentraCheckoutApi.SelectionResponse>,
  ) {
    if (isValidEvent(eventName)) {
      this.eventHandlers[eventName]?.forEach((handler) => handler(payload));
    }
  }
}

// create default singleton instance
if (!CentraEvents.default) {
  CentraEvents.default = new CentraEvents();
}

export default CentraEvents;
