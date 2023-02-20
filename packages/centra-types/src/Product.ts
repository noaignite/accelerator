import BundleInfo from './BundleInfo'
import Category from './Category'

export default interface Product {
  available: boolean
  relatedProducts: RelatedProduct[]
  bundleInfo: BundleInfo
  product: string
  name: string
  uri: string
  sku: string
  productSku: string
  brand: string
  brandName: string
  brandUri: string
  collection: string
  collectionName: string
  collectionUri: string
  variantName: string
  countryOrigin: string
  excerpt: string
  excerptHtml: string
  description: string
  descriptionHtml: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  stockUnit: string
  category: string
  centraProduct: string
  centraVariant: string
  itemQuantityMinimum: number
  itemQuantityMultipleOf: number
  price: string
  priceAsNumber: number
  priceBeforeDiscount: string
  priceBeforeDiscountAsNumber: number
  discountPercent: number
  lowestPrice: [
    {
      periodDays: number
      price: string
      priceAsNumber: number
      priceBeforeDiscount: string
      priceBeforeDiscountAsNumber: number
    },
  ]
  showAsOnSale: boolean
  showAsNew: boolean
  itemTable: {
    unit: string
    x: string[]
    dividerSymbol: string
    y: []
  }
  tableMappings: Record<
    string,
    {
      unit: string
      x: Record<string, string>
      /**
       * This property is not documented in the Swagger specification.
       */
      y: unknown[]
      dividerSymbol: string[]
      countries: string[]
    }
  >
  defaultLocalizedChart: string
  items: [
    {
      item: string
      ean: string
      sizeId: string
      itemTableY: number
      itemTableX: number
      name: string
      sku: string
      stock: string | number
    },
  ]
  categoryName: string[]
  categoryUri: string
  categories: {
    sortOrder: number
    name: string[]
    category: string
    uri: string
  }[]
  media: Record<string, string[]>
  preview: boolean
  subscriptionPlans: {
    name: string
    intervalValue: number
    intervalType: string
    discountPercent: number
    shippingType: string
    subscriptionPlan: number
    status: string
    price: string
    priceAsNumber: number
    priceAfterDiscount: string
    priceAfterDiscountAsNumber: number
  }[]

  relation: string
}

export interface RelatedProduct extends Omit<Product, 'relatedProducts'> {
  relatedProducts: Pick<Product, 'available' | 'media' | 'product' | 'relation'>[]
}

export interface ProductWithPrices
  extends Omit<
    Product,
    | 'price'
    | 'priceAsNumber'
    | 'priceBeforeDiscount'
    | 'priceBeforeDiscountAsNumber'
    | 'discountPercent'
    | 'showAsOnSale'
    | 'showAsNew'
  > {
  prices: Record<
    string,
    Pick<
      Product,
      | 'price'
      | 'priceAsNumber'
      | 'priceBeforeDiscount'
      | 'priceBeforeDiscountAsNumber'
      | 'discountPercent'
      | 'showAsOnSale'
      | 'showAsNew'
    >
  >
}

export interface ProductWithMarkets extends Product {
  markets: number[]
}

export interface ProductUriResponse<P = Product> {
  found: string
  product: P
  category: Category
}
