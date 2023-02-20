import Product, { RelatedProduct } from './Product'
import BundleInfo from './BundleInfo'

export default interface Bundle extends Product {
  bundleInfo: BundleInfoExtended
}

export interface BundleInfoExtended extends BundleInfo {
  sections: {
    section: string
    quantity: number
    products: number[]
  }[]
}

export interface BundleResponse {
  bundle: Bundle
  sectionProducts: RelatedProduct
}
