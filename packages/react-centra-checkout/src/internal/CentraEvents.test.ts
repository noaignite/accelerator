import { selectionEmptyResponse } from '@noaignite/centra-mocks'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CentraEvents } from './CentraEvents'

const centraEvents = new CentraEvents()

describe('CentraEvents', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    centraEvents.eventHandlers.addItem?.clear()
    centraEvents.eventHandlers.centra_checkout_payment_callback?.clear()
    centraEvents.eventHandlers.centra_checkout_callback?.clear()
  })

  it('Exposes a static instance via `default` property between instances', () => {
    const otherCentraEvents = new CentraEvents()

    expect(centraEvents.default).toBe(otherCentraEvents.default)
  })

  describe('on', () => {
    it('validates event name', () => {
      // @ts-expect-error -- The event name is expected to be wrong.
      const hasAttachedListener = centraEvents.on('unknown_event_name', () => {})

      expect(hasAttachedListener).toBe(false)

      // No `eventHandlers` are expected to have been added.
      expect(centraEvents.eventHandlers.centra_checkout_callback?.size).toBe(0)
      expect(centraEvents.eventHandlers.centra_checkout_payment_callback?.size).toBe(0)
    })

    it('exposes event specific callback signatures', () => {
      const callback = vi.fn((payload, item: string, quantity = 1) => ({
        payload,
        item,
        quantity,
      }))

      const hasAttachedListener = centraEvents.on('addItem', callback)

      expect(hasAttachedListener).toBe(true)

      // @ts-expect-error -- `centra_checkout_callback` only forwards the payload.
      centraEvents.on('centra_checkout_callback', (_payload, _line: string) => null)
    })
  })

  describe('dispatch', () => {
    it('forwards event to attached event listeners', () => {
      const callback = vi.fn()

      const hasAttachedListener = centraEvents.on('centra_checkout_callback', callback)

      expect(hasAttachedListener).toBe(true)

      expect(callback).not.toHaveBeenCalledWith(selectionEmptyResponse)

      centraEvents.dispatch('centra_checkout_callback', selectionEmptyResponse)

      expect(callback).toHaveBeenCalledWith(selectionEmptyResponse)
    })

    it('forwards handler args after the payload', () => {
      const callback = vi.fn()

      centraEvents.on('addItem', callback)

      centraEvents.dispatch('addItem', selectionEmptyResponse, '123', 2)

      expect(callback).toHaveBeenCalledWith(selectionEmptyResponse, '123', 2)
    })
  })

  describe('off', () => {
    it('validates event name', () => {
      const callback = () => {}

      const hasAttachedListener = centraEvents.on('centra_checkout_callback', callback)

      expect(hasAttachedListener).toBe(true)

      // @ts-expect-error -- The event name is expected to be wrong.
      const hasDetachedListener = centraEvents.off('unknown_event_name', callback)

      expect(hasDetachedListener).toBe(false)
      expect(centraEvents.eventHandlers.centra_checkout_callback?.size).toBe(1)
    })

    it('detaches event listener', () => {
      const callback = () => {}

      expect(centraEvents.eventHandlers.centra_checkout_callback?.size).toBe(0)
      centraEvents.on('centra_checkout_callback', callback)

      expect(centraEvents.eventHandlers.centra_checkout_callback?.size).toBe(1)

      centraEvents.off('centra_checkout_callback', callback)

      expect(centraEvents.eventHandlers.centra_checkout_callback?.size).toBe(0)
    })
  })
})
