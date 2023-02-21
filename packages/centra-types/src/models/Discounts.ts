import Voucher from './Voucher'

export default interface Discounts {
  anyDiscount?: boolean
  discount?: string
  discountAsNumber?: number
  automaticDiscounts?: AutomaticDiscount[]
  vouchers?: Voucher[]
}

export interface AutomaticDiscount {
  automaticDiscount?: boolean
  name?: string
  priceOff?: string
  priceOffAsNumber?: number
}
