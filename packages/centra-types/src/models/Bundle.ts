import { BundleInfoExtended } from './BundleInfo'
import { Product } from './Product'

export interface Bundle extends Product {
  bundleInfo?: BundleInfoExtended
}
