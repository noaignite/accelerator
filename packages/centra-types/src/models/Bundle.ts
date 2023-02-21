import Product, { RelatedProduct } from './Product'
import { BundleInfoExtended } from './BundleInfo'

export default interface Bundle extends Product {
  bundleInfo: BundleInfoExtended
}

export interface BundleResponse {
  bundle: Bundle
  sectionProducts: RelatedProduct
}
