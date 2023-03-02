import Bundle from '../models/Bundle'
import Product from '../models/Product'

export default interface BundleResponse {
  bundle?: Bundle
  sectionProducts?: Product[]
}
