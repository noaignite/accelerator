import Address, { ShippingAddress } from '../models/Address'
import Country from '../models/Country'
import Language from '../models/Language'
import LoggedIn from '../models/LoggedIn'
import PaymentField from '../models/PaymentField'
import PaymentMethod from '../models/PaymentMethod'
import Selection from '../models/Selection'
import ShippingMethod from '../models/ShippingMethod'

export default interface SelectionResponse {
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
