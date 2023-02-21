import Address, { ShippingAddress } from './Address'
import Country from './Country'
import Currency from './Currency'
import Discounts from './Discounts'
import Item from './Item'
import Language from './Language'
import LoggedIn from './LoggedIn'
import PluginFields from './PluginFields'
import Shipment from './Shipment'
import Totals from './Totals'

export default interface Order {
  order?: string
  status?: 'untouched' | 'progress' | 'ok' | 'archived' | 'failed'
  statusDescription?:
    | 'Pending'
    | 'Confirmed'
    | 'Processing'
    | 'Completed'
    | 'Archived'
    | 'Cancelled'
    | 'Incomplete'
  date?: string
  giftMessage?: string
  shipments?: Shipment[]
  language?: string
  currency?: string
  paymentMethod?: string
  paymentMethodName?: string
  shippingMethod?: string
  shippingMethodName?: string
  pluginFields?: PluginFields
  centraCheckoutScript?: string
  items?: Item[]
  discounts?: Discounts
  totals?: Totals
  vatExempt?: boolean
  additionalNotes?: string
  address?: Address
  shippingAddress?: ShippingAddress
  currencyFormat?: Currency
}

export interface OrderCompleteResponse {
  order?: Order
  languages?: Language[]
  countries?: Country[]
  loggedIn?: LoggedIn
  location?: Location
}

export interface OrdersResponse {
  orders?: Order[]
  ordersPaging?: {
    from?: number
    size?: number
    totalSize?: number
  }
  languages?: Language[]
  countries?: Country[]
  loggedIn?: LoggedIn
  location?: Location
}
