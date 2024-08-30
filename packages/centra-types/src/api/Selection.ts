import {
  Address,
  Country,
  Language,
  Location,
  LoggedIn,
  PaymentField,
  PaymentMethod,
  Selection,
  ShippingAddress,
  ShippingMethod,
} from '../models'

export interface SelectionResponse {
  selection?: Selection
  paymentMethods?: PaymentMethod[]
  paymentFields?: {
    termsAndConditions?: PaymentField
    address?: Record<keyof Address, PaymentField>
    shippingAddress?: Record<keyof ShippingAddress, PaymentField>
  }
  shippingMethods?: ShippingMethod[]
  countries?: Country[]
  languages?: Language[]
  location?: Location
  loggedIn?: LoggedIn
}
