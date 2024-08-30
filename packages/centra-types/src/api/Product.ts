import { Category, Filter, Product } from '../models'

export interface ProductResponse<P = Product> {
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
