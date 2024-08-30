import { Currency } from './Currency'

export interface Pricelist {
  pricelist?: string
  name?: string
  default?: boolean
  currency?: Currency
}
