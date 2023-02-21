import Product from './Product'
import { BundleInfoExtended } from './BundleInfo'

export default interface Bundle extends Product {
  bundleInfo?: BundleInfoExtended
}
