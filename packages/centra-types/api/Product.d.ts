import Product from '../models/Product'
import Category from '../models/Category'
import Filter from '../models/Filter'

export default interface ProductResponse<P = Product> {
  product?: P
}

export interface ProductUriResponse<P = Product> {
  found?: string
  product?: P
  category?: Category
}

export interface ProductsResponse<P = Product> {
  products?: P[]
  productCount?: number
  filter?: Filter[]
}
