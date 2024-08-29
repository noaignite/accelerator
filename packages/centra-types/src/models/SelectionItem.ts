import { Product } from './Product'

export interface SelectionItem {
  item?: string
  productUrl?: string
  category?: string
  comment?: string
  size?: string
  sku?: string
  ean?: string
  quantity: number
  subscriptionPlan?: {
    name?: string
    intervalValue?: number
    intervalType?: string
    discountPercent?: number
    shippingType?: string
    subscriptionPlan?: number
    status?: string
    price?: string
    priceAsNumber?: number
    priceAfterDiscount?: string
    priceAfterDiscountAsNumber?: number
  }
  line?: string
  priceEach?: string
  priceEachAsNumber?: number
  totalPrice?: string
  totalPriceAsNumber?: number
  priceEachBeforeDiscount?: string
  priceEachBeforeDiscountAsNumber?: number
  anyDiscount?: boolean
  campaign?: {
    name?: string
    discount?: string
    discountAsNumber?: number
  }
  taxPercent?: number
  priceEachWithoutTax?: string
  priceEachWithoutTaxAsNumber?: number
  priceEachReduction?: string
  priceEachReductionAsNumber?: number
  totalPriceBeforeDiscount?: string
  totalPriceBeforeDiscountAsNumber?: number
  bundle?: {
    item?: string
    product?: string
    brandName?: string
    productName?: string
    productUrl?: string | null
    category?: string | null
    size?: string
    sku?: string
    ean?: string
    silkProduct?: string
    silkVariant?: string
    quantity: number
    comment?: string
    localizedSize?: string | null
    priceEach?: string
    priceEachAsNumber?: number
    totalPrice?: string
    totalPriceAsNumber?: number
    priceEachBeforeDiscount?: string
    priceEachBeforeDiscountAsNumber?: number
    anyDiscount?: boolean
    taxPercent?: number
    priceEachWithoutTax?: string
    priceEachWithoutTaxAsNumber?: number
    priceEachReduction?: string
    priceEachReductionAsNumber?: number
    totalPriceBeforeDiscount?: string
    totalPriceBeforeDiscountAsNumber?: number
  }[]
  product?: Omit<Product, 'relatedProducts'>
}
