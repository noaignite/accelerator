import Product, { BundleInfo, RelatedProduct } from './Product'

export default interface Bundle extends Product {
  bundleInfo: BundleInfoExtended
  sectionProducts: RelatedProduct
}

export interface BundleInfoExtended extends BundleInfo {
  sections: {
    section: string
    quantity: number
    products: number[]
  }[]
}
