import Address, { ShippingAddress } from './Address'
import Country from './Country'
import Discounts from './Discounts'
import Item from './Item'
import Language from './Language'
import LoggedIn from './LoggedIn'
import PaymentMethod from './PaymentMethod'
import PluginFields from './PluginFields'
import Shipment from './Shipment'
import Totals from './Totals'

export default interface Selection {
  selection?: {
    pluginFields?: PluginFields
    centraCheckoutScript?: string
    language?: string
    currency?: string
    paymentMethod?: string
    paymentMethodName?: string
    shippingMethod?: string
    shippingMethodName?: string
    items?: Item[]
    discounts?: Discounts
    totals?: Totals
    vatExempt?: boolean
    address?: Address
    shippingAddress?: ShippingAddress
    additionalNotes?: string
    currencyFormat?: {
      currency?: string
      name?: string
      prefix?: string
      suffix?: string
      decimalPoint?: string
      decimalDigits?: string
      uri?: string
    }
  }
  shipments?: Shipment[]
  languages?: Language[]
  paymentMethods?: PaymentMethod[]
  paymentFields?: {
    termsAndConditions?: PaymentField
    address?: Record<keyof Address, PaymentField>
    shippingAddress?: Record<keyof ShippingAddress, PaymentField>
  }
  shippingMethods?: ShippingMethod[]
  countries?: Country[]
  loggedIn?: LoggedIn
  location?: Location
}

export interface PaymentField {
  type?: string
  visible?: boolean
  required?: boolean
}

export interface ShippingMethod {
  shippingMethod?: string
  name?: string
  price?: string
  priceAsNumber?: number
}
