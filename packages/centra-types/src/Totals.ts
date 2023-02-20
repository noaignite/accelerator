export default interface Totals {
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
