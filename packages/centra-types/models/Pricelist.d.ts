import Currency from './Currency'

export default interface Pricelist {
  pricelist?: string
  name?: string
  default?: boolean
  currency?: Currency
}
