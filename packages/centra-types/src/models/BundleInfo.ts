export interface BundleInfo {
  bundle?: number
  discount?: number
  priceMax?: string
  priceMaxAsNumber?: number
  priceMaxBeforeDiscount?: string
  priceMaxBeforeDiscountAsNumber?: number
  priceMin?: string
  priceMinAsNumber?: number
  priceMinBeforeDiscount?: string
  priceMinBeforeDiscountAsNumber?: number
  priceOfItems?: string
  priceType?: string
  type?: string
}

export interface BundleInfoExtended extends BundleInfo {
  sections?: BundleSection[]
}

export interface BundleSection {
  section?: number
  quantity?: number
  products?: number[]
}
