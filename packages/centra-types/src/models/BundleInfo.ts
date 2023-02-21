export default interface BundleInfo {
  bundle?: number
  priceType?: string
  type?: string
  priceOfItems?: number
  priceMin?: string
  priceMinAsNumber?: number
  priceMax?: string
  priceMaxAsNumber?: number
  discount?: number
}

export interface BundleInfoExtended extends BundleInfo {
  sections?: BundleSection[]
}

export interface BundleSection {
  section?: string
  quantity?: number
  products?: number[]
}
