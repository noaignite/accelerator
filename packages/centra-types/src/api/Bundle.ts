import { Bundle, Product } from '../models'

export interface BundleResponse {
  bundle?: Bundle
  sectionProducts?: Product[]
}
