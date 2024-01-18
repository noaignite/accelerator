import { OverridableObject, OverridableStringUnion, Prettify } from '../utils'
import BundleInfo from './BundleInfo'
import Item from './Item'

export interface ProductMeasurementChartOverrides {}
export interface ProductRelatedProductOverrides {}
export interface ProductPriceAttributeOverrides {}

export default interface Product {
  available?: boolean
  relatedProducts?: RelatedProduct[]
  bundleInfo?: BundleInfo
  product?: string
  name?: string
  uri?: string
  sku?: string
  productSku?: string
  brand?: string
  brandName?: string | null
  brandUri?: string | null
  collection?: string
  collectionName?: string | null
  collectionUri?: string | null
  variantName?: string
  countryOrigin?: string
  excerpt?: string
  excerptHtml?: string
  description?: string
  descriptionHtml?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  stockUnit?: string
  category?: string
  centraProduct?: string
  centraVariant?: string
  itemQuantityMinimum?: number
  itemQuantityMultipleOf?: number
  price?: string
  priceAsNumber?: number
  priceBeforeDiscount?: string
  priceBeforeDiscountAsNumber?: number
  discountPercent?: number
  lowestPrice?: {
    periodDays?: number
    price?: string
    priceAsNumber?: number
    priceBeforeDiscount?: string
    priceBeforeDiscountAsNumber?: number
  }[]
  showAsOnSale?: boolean
  showAsNew?: boolean
  itemTable?: {
    unit?: string
    original?: {
      x?: string[]
      y?: string[]
    }
    x?: string[]
    dividerSymbol?: string
    desc?: string
    y?: string[]
  }
  tableMappings?: Record<
    string,
    {
      unit?: string
      x?: Record<string, string>
      // TODO: type this
      /**
       * This property is not documented in the Swagger specification.
       */
      y?: unknown[]
      dividerSymbol?: string[]
      countries?: string[]
    }
  >
  defaultLocalizedChart?: string
  items?: Item[]
  categoryName?: string[] | null
  categoryUri?: string | null
  categories?: {
    pathIds?: string[]
    sortOrder?: number
    name?: string[]
    category?: string
    uri?: string
  }[]
  media?: Record<string, string[]>
  mediaObjects?: {
    media?: number
    sources?: Record<string, { url?: string }[]>
    // TODO: type this
    attributes: unknown[]
  }[]
  modifiedAt?: string
  // TODO: type this
  measurementChart: OverridableObject<unknown[], ProductMeasurementChartOverrides>
  createdAt: string
  preview?: boolean
  subscriptionPlans?: {
    name?: string
    intervalValue?: number
    intervalType?: string
    discountPercent?: number
    shippingType?: string
    subscriptionPlan?: number
    status?: string
    price?: string
    priceAsNumber?: number
    priceAfterDiscount?: string
    priceAfterDiscountAsNumber?: number
  }[]

  relation?: string
}

export type RelatedProduct = OverridableObject<
  Prettify<
    Omit<Product, 'relatedProducts'> & {
      relatedProducts?: Pick<Product, 'available' | 'media' | 'product' | 'relation'>[]
    }
  >,
  ProductRelatedProductOverrides
>

export type ProductPriceAttribute = OverridableStringUnion<
  | 'price'
  | 'priceAsNumber'
  | 'priceBeforeDiscount'
  | 'priceBeforeDiscountAsNumber'
  | 'discountPercent'
  | 'showAsOnSale'
  | 'showAsNew',
  ProductPriceAttributeOverrides
>

export type ProductWithPrices = Prettify<
  Omit<Product, ProductPriceAttribute> & {
    prices?: Record<string, Pick<Product, ProductPriceAttribute>>
  }
>

export type ProductWithMarkets = Prettify<
  Product & {
    markets?: number[]
  }
>
