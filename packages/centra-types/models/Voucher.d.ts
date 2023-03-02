export default interface Voucher {
  voucher?: string
  type?: 'code' | 'uri' | 'other'
  description?: string
  priceOff?: string
  priceOffAsNumber?: number
}
