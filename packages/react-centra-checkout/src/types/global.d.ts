import type { Address } from '@noaignite/centra-types'

type AdyenDropInEvent = CustomEvent<{
  /**
   * Always `true` for Adyen Drop-In. This means the payment callback needs a response event to complete, with the following name: `centra_checkout_payment_response`
   *
   */
  responseEventRequired: boolean
  /**
   * 	Will be `true` when `billingAddress` and `shippingAddress` is included in the event. This one will be false if Adyen Drop-In was not initiated with an address included, using `paymentInitiateOnly: true`.
   *
   */
  addressIncluded: boolean
  /**
   * 	This data should be sent to the `POST /payment` call in Centra for the payment to be validated.
   *
   */
  paymentMethodSpecificFields: Record<string, unknown>
  /**
   * The selected payment method used.
   */
  paymentMethod: string
  /**
   * The billing address of the customer.
   */
  billingAddress: Address
  /**
   * The shipping address of the customer.
   */
  shippingAddress: Address
}>

declare global {
  interface Window {
    // the interface that the centra checkout scripts adds to window
    CentraCheckout?: {
      suspend: () => void
      resume: () => void
      reInitiate: (plugin: string) => void
    }
  }

  interface GlobalEventHandlersEventMap {
    centra_checkout_callback: CustomEvent<Record<string, unknown> | undefined>
    /**
     *
     * @see https://centra.dev/docs/extend-with-plugins/checkout/adyen-drop-in#the-dom-events-in-adyen-drop-in
     */
    centra_checkout_payment_callback: AdyenDropInEvent
  }
}
