import { BundleInfoExtended } from './BundleInfo'
import Product from './Product'

export default interface Bundle extends Product {
  bundleInfo?: BundleInfoExtended
}
