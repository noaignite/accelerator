import type { Alpha3Code as ImportedAlpha3Code } from 'iso-3166-1-ts'

export namespace Klarna {
  /**
   * @desc ISO 3166-1 Alpha 3 code in lowercase
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/
   */
  type Alpha3Code = Lowercase<ImportedAlpha3Code>

  /**
   * @desc  Either string `"person"` or `"organization"`
   *
   */
  type CustomerType = 'person' | 'organization'

  /**
   * @desc  The `load` event is triggered whenever Klarna Checkout has rendered for a customer within its iFrame.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-load-event
   */
  export type LoadEvent = {
    customer: {
      /**
       * @desc  Either string `"person"` or `"organization"`
       *
       */
      type: CustomerType
    }
    shipping_address: {
      /**
       * @desc ISO 3166-1 Alpha 3 code in lowercase
       *
       * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/
       */
      country: Alpha3Code
      /**
       * @desc Postal code without whitespaces
       *
       */
      postal_code: string
    }
  }

  /**
   * @desc The `user_interacted` event is triggered whenever the user interacts with the KCO iframe either by clicking or typing. This event will only be triggered for the first interaction.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-user_interacted-event
   */
  export type UserInteractedEvent = {
    /**
     * @desc `"mousedown"` or `"keydown"` depending on the user interaction
     *
     */
    type: 'mousedown' | 'keydown'
  }

  /**
   * @desc The `customer` event is triggered whenever Klarna Checkout has detected the customer type or a customer type change. Currently `"organization"` and `"person"` are the two supported types.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-customer-event
   */
  export type CustomerEvent = {
    /**
     * @desc  Either string `"person"` or `"organization"`
     *
     */
    type: CustomerType
  }

  /**
   * @desc The `change` event is triggered when the user changes postal code, country or email in their billing address. It is also triggered for given/family name except in the AT & DE markets.
   * @note The data returned is not guaranteed to be in the data object. As an example, customer gets prefilled by Klarna and some data gets obfuscated. Obfuscated data is not sent through the API.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-change-event
   */
  export type ChangeEvent = ChangeEventATDE | ChangeEventOther

  type ChangeEventATDE = {
    email?: string
    /**
     * @desc Postal code without whitespaces
     */
    postal_code?: string
    /**
     * @desc ISO 3166-1 Alpha 3 code in lowercase
     *
     * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/
     */
    country?: Extract<Alpha3Code, 'aut' | 'deu'>
  }

  type ChangeEventOther = Omit<ChangeEventATDE, 'country'> & {
    country?: Exclude<Alpha3Code, 'aut' | 'deu'>
    given_name?: string
    family_name?: string
  }

  /**
   * @desc The `billing_address_change` event is triggered when Checkout has detected a complete and valid billing address for the customer.
   * @note The data returned is not guaranteed to be in the data object. As an example, customer gets prefilled by Klarna and some data gets obfuscated. Obfuscated data is not sent through the API.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-billing_address_change-event
   */
  export type BillingAddressChangeEvent =
    | BillingAddressChangeEventATDE
    | BillingAddressChangeEventOther

  type BillingAddressChangeEventATDE = {
    /**
     * @desc Postal code without whitespaces
     */
    postal_code?: string
    /**
     * @desc ISO 3166-1 Alpha 3 code in lowercase
     *
     * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/
     */
    country?: Extract<Alpha3Code, 'aut' | 'deu'>
  }

  type BillingAddressChangeEventOther = Omit<BillingAddressChangeEventATDE, 'country'> & {
    country?: Exclude<Alpha3Code, 'aut' | 'deu'>
    given_name?: string
    family_name?: string
    email?: string
  }

  /**
   * @desc The `shipping_address_change` event is triggered when Checkout has detected a complete and valid shipping address for the customer. The shipping address will always be the same as billing address, unless a separate shipping address has been provided by the customer.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-shipping_address_change-event
   */
  export type ShippingAddressChangeEvent =
    | ShippingAddressChangeEventATDE
    | ShippingAddressChangeEventOther

  type ShippingAddressChangeEventATDE = {
    /**
     * @desc Postal code without whitespaces
     */
    postal_code?: string
    /**
     * @desc ISO 3166-1 Alpha 3 code in lowercase
     *
     * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/
     */
    country?: Extract<Alpha3Code, 'aut' | 'deu'>
  }

  export type ShippingAddressChangeEventOther = Omit<ShippingAddressChangeEventATDE, 'country'> & {
    given_name?: string
    family_name?: string
    email?: string
    country?: Exclude<Alpha3Code, 'aut' | 'deu'>
  }

  /**
   * @desc The `shipping_option_change` event is triggered when the customer has selected a new shipping option.
   * The event data contains a shipping options object with `price`, `tax_amount`, and `tax_rate` is expressed in [minor units](https://docs.klarna.com/klarna-checkout/api/#tag/Data-Types) (e.g. cents).
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-shipping_option_change-event
   */
  export type ShippingOptionChangeEvent = {
    description: string
    id: string
    name: string
    price: number
    promo: string
    tax_amount: number
    tax_rate: number
  }

  /**
   * @desc The `shipping_address_update_error` is a generic error that is triggered whenever something goes wrong when updating shipping methods/options. The event data is an empty object.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-shipping_address_update_error-event
   */
  export type ShippingAddressUpdateError = object

  /**
   * @desc The `order_total_change` event is triggered when the order total has changed.
   * The event data contains an object with the order total, expressed in [minor units](https://docs.klarna.com/klarna-checkout/api/#tag/Data-Types) (e.g. cents).
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-order_total_change-event
   */
  export type OrderTotalChangeEvent = {
    order_total: number
  }

  /**
   * @desc The `checkbox_change` event is triggered everytime a checkbox is checked/unchecked.
   * The event data contains an object with the checkbox key and if the checkbox was checked or unchecked.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-checkbox_change-event
   */
  export type CheckboxChangeEvent = {
    /**
     * the same the merchant sends to KCO on the `id` property for the [additional checkboxes](https://developers.klarna.com/api/#checkout-api__create-a-new-orderoptions__additional_checkbox)
     */
    key: string
    checked: boolean
  }

  /**
   * @desc The `can_not_complete_order` event is triggered when the merchant has to provide other means of paying. A normal case when this happens is when only Credit payment options are available but the customer was refused credit.
   * The event data is an empty object.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-can_not_complete_order-event
   */
  export type CanNotCompleteOrderEvent = object

  /**
   * @desc The `network_error` event is triggered when a network issue has been detected, which could basically mean that the customer has lost internet connection.
   * The event data is an empty object.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-network_error-event
   */
  export type NetworkErrorEvent = object

  /**
   * @desc The `redirect_initiated` event is triggered after the user has completed all the required steps to complete the purchase and is about to get redirected to the confirmation page.
   * The event data is always `true`.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-redirect_initiated-event
   */
  export type RedirectInitiatedEvent = true

  /**
   * @desc The `load_confirmation` event is triggered whenever Klarna confirmation page has rendered for a customer within its iFrame.
   * The event data is an empty object.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-load_confirmation-event
   */
  export type LoadConfirmationEvent = object

  /**
   *
   *
   * @desc If you send this property `options.require_client_validation` as `true` while creating the order, the client will give you the chance to do some client validations after the `validation_callback` event is triggered.
   *
   * The `validation_callback` event is triggered when the user clicks the buy button and before the client requests the server to process the purchase.
   * The event data is an empty object.
   *
   * @see https://docs.klarna.com/klarna-checkout/in-depth-knowledge/client-side-events/#checkout-events-the-validation_callback-event
   */
  export type ValidationCallbackEvent = object

  export type EventListeners = Partial<{
    load: (data: LoadEvent) => void
    user_interacted: (data: UserInteractedEvent) => void
    customer: (data: CustomerEvent) => void
    change: (data: ChangeEvent) => void
    shipping_address_change: (data: ShippingAddressChangeEvent) => void
    shipping_option_change: (data: ShippingOptionChangeEvent) => void
    order_total_change: (data: OrderTotalChangeEvent) => void
    checkbox_change: (data: CheckboxChangeEvent) => void
    can_not_complete_order: (data: CanNotCompleteOrderEvent) => void
    network_error: (data: NetworkErrorEvent) => void
    redirect_initiated: (data: RedirectInitiatedEvent) => void
    load_confirmation: (data: LoadConfirmationEvent) => void
    validation_callback: (
      data: ValidationCallbackEvent,
      callback: (param: { should_proceed: boolean; message?: string }) => void,
    ) => void
  }>

  export type Api = {
    suspend: (event: unknown) => Api
    resume: () => Api
    on: (eventListeners: EventListeners) => Api
  }

  export type CheckoutCallback = (api: Api) => void
}
