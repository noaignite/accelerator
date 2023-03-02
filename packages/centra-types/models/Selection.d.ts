import Address, { ShippingAddress } from './Address'
import Currency from './Currency'
import Discounts from './Discounts'
import PluginFields from './PluginFields'
import SelectionItem from './SelectionItem'
import Totals from './Totals'

export default interface Selection {
  pluginFields?: PluginFields
  centraCheckoutScript?: string
  language?: string
  currency?: string
  paymentMethod?: string
  paymentMethodName?: string
  shippingMethod?: string
  shippingMethodName?: string
  items?: SelectionItem[]
  discounts?: Discounts
  totals?: Totals
  vatExempt?: boolean
  address?: Address
  shippingAddress?: ShippingAddress
  additionalNotes?: string
  currencyFormat?: Currency
}
