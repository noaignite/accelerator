export type CurrencyValue = number

export interface KlaviyoProductItem {
  ProductName: string
  ProductID: string
  SKU: string
  Categories: string[]
  ImageURL: string
  URL: string
  Brand: string
  Price: CurrencyValue
  CompareAtPrice?: CurrencyValue
}

export interface KlaviyoViewedItemPayload {
  Title: string
  ItemId: string
  Categories: string[]
  ImageUrl: string
  Url: string
  Metadata: {
    Brand: string
    Price: CurrencyValue
    CompareAtPrice?: CurrencyValue
  }
}

export interface KlaviyoCartLineItem {
  ProductID: string
  SKU: string
  ProductName: string
  Quantity: number
  ItemPrice: CurrencyValue
  RowTotal: CurrencyValue
  ProductURL: string
  ImageURL: string
  ProductCategories: string[]
}

export interface KlaviyoAddedToCartPayload {
  $value: CurrencyValue
  AddedItemProductName: string
  AddedItemProductID: string
  AddedItemSKU: string
  AddedItemCategories: string[]
  AddedItemImageURL: string
  AddedItemURL: string
  AddedItemPrice: CurrencyValue
  AddedItemQuantity: number
  ItemNames: string[]
  CheckoutURL: string
  Items: KlaviyoCartLineItem[]
}

export interface KlaviyoStartedCheckoutPayload {
  $event_id: string
  $value: CurrencyValue
  ItemNames: string[]
  CheckoutURL: string
  Categories: string[]
  Items: KlaviyoCartLineItem[]
}

export interface KlaviyoIdentifyPayload {
  email: string
  first_name?: string
  last_name?: string
  [key: string]: string | number | boolean | null | undefined
}

export type KlaviyoTrackEventName = 'Viewed Product' | 'Added to Cart' | 'Started Checkout'

export interface KlaviyoTrackEventPayloadMap {
  'Viewed Product': KlaviyoViewedItemPayload
  'Added to Cart': KlaviyoAddedToCartPayload
  'Started Checkout': KlaviyoStartedCheckoutPayload
}
