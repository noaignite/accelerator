import Item from './Item'
import Language from './Language'
import PaymentMethod from './PaymentMethod'
import Country from './Country'

export default interface Selection {
  pluginFields: {
    shipwallet: {
      version: number
      snippet: string
      session_id: string
      deliveryOptionsAvailable: boolean
    }
  }
  language: string
  currency: string
  paymentMethod: string
  paymentMethodName: string
  shippingMethod: string
  shippingMethodName: string
  items: Item[]
  discounts: {
    anyDiscount: boolean
    discount: string
    discountAsNumber: number
    automaticDiscounts: AutomaticDiscount[]
    vouchers: Voucher[]
  }
  totals: Totals
  vatExempt: boolean
  address: Address
  shippingAddress: ShippingAddress
  additionalNotes: string
  currencyFormat: {
    currency: string
    name: string
    prefix: string
    suffix: string
    decimalPoint: string
    decimalDigits: string
    uri: string
  }
  shipments: Shipment[]
  languages: Language[]
  paymentMethods: PaymentMethod[]
  paymentFields: {
    termsAndConditions: PaymentField
    address: Record<keyof Address, PaymentField>
    shippingAddress: Record<keyof ShippingAddress, PaymentField>
  }
  shippingMethods: ShippingMethod[]
  countries: Country[]
  loggedIn: {
    email: string
    firstName: string
    lastName: string
    gender: string
    address1: string
    address2: string
    zipCode: string
    city: string
    state: string
    country: string
    phoneNumber: string
    language: string
    newsletter: boolean
  }
  location: {
    country: string
    name: string
    state: string
    stateName: string
    eu: boolean
    shipTo: boolean
    language: Language
  }
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  company: string
  address1: string
  address2: string
  zipCode: string
  city: string
  state: string
  country: string
  vatNumber: string
}

export interface PaymentField {
  type: string
  visible: boolean
  required: boolean
}

export type ShippingAddress = Omit<Address, 'vatNumber'>

export interface ShippingMethod {
  shippingMethod: string
  name: string
  price: string
  priceAsNumber: number
}

export interface Shipment {
  shipmentId: string
  shippedDate: string
  carrier: string
  service: string
  trackingId: string
  trackingUrl: string
  returnSlipTracking: string
  additionalMessage: string
}

export interface Totals {
  itemsTotalPrice: string
  itemsTotalPriceAsNumber: number
  totalDiscountPrice: boolean
  totalDiscountPriceAsNumber: boolean
  shippingPrice: string
  shippingPriceAsNumber: number
  handlingCostPrice: string
  handlingCostPriceAsNumber: number
  totalQuantity: number
  taxDeducted: boolean
  taxDeductedAsNumber: boolean
  taxAdded: boolean
  taxAddedAsNumber: boolean
  taxPercent: number
  grandTotalPrice: string
  grandTotalPriceAsNumber: number
  grandTotalPriceTax: string
  grandTotalPriceTaxAsNumber: number
}

export interface Voucher {
  voucher: string
  type: 'code' | 'uri' | 'other'
  description: string
  priceOff: string
  priceOffAsNumber: number
}

export interface AutomaticDiscount {
  automaticDiscount: boolean
  name: string
  priceOff: string
  priceOffAsNumber: number
}
