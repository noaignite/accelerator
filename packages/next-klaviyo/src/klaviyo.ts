import type {
  KlaviyoIdentifyPayload,
  KlaviyoTrackEventName,
  KlaviyoTrackEventPayloadMap,
} from './types'

type KlaviyoCall = () => void

const queuedCalls: KlaviyoCall[] = []

function getKlaviyoSdk() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.klaviyo ?? null
}

function callSdkOrQueue(call: KlaviyoCall) {
  const sdk = getKlaviyoSdk()

  if (sdk) {
    call()

    return
  }

  queuedCalls.push(call)
}

function flushQueue() {
  if (!getKlaviyoSdk()) {
    return
  }

  while (queuedCalls.length > 0) {
    const call = queuedCalls.shift()

    call?.()
  }
}

export function notifyKlaviyoLoaded() {
  flushQueue()
}

export const klaviyo = {
  identify(payload: KlaviyoIdentifyPayload) {
    callSdkOrQueue(() => {
      const sdk = getKlaviyoSdk()

      if (!sdk) {
        return
      }

      if (typeof sdk.identify === 'function') {
        sdk.identify(payload)

        return
      }

      if (typeof sdk.push === 'function') {
        sdk.push(['identify', payload])
      }
    })
  },

  track<TEventName extends KlaviyoTrackEventName>(
    eventName: TEventName,
    payload: KlaviyoTrackEventPayloadMap[TEventName],
  ) {
    callSdkOrQueue(() => {
      const sdk = getKlaviyoSdk()

      if (!sdk) {
        return
      }

      if (typeof sdk.track === 'function') {
        sdk.track(eventName, payload)

        return
      }

      if (typeof sdk.push === 'function') {
        sdk.push(['track', eventName, payload])
      }
    })
  },
}
