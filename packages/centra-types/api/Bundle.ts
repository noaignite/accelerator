import Bundle from '../models/Bundle'
import { RelatedProduct } from '../models/Product'

export default interface BundleResponse {
  bundle?: Bundle
  sectionProducts?: RelatedProduct
}
