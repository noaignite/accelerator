/*
  These definitions were based on the Centra checkout api swagger https://docs.centra.com/swagger-ui/?api=CheckoutAPI
  The types were initially generated using https://github.com/acacode/swagger-typescript-api
  and then modified because of errors in the documentation
*/

declare namespace Centra {
  namespace CheckoutApi {
    /**
     * Smaller category object compared to Category, used for products
     */
    interface CategoryForProduct {
      /** Category ID */
      category?: string

      /** Each sub category name as an element. Root category first. */
      name?: string[]

      /** Integer. Sort order for the product in this category */
      sortOrder?: number

      /** Full category URI */
      uri?: string
    }

    /**
     * Bundle information object
     */
    interface BundleInfo {
      /** Integer. bundle id */
      bundle?: number

      /** Possible values: 'fixed', 'flexible' */
      type?: 'fixed' | 'flexible'

      /** Possible values: 'static', 'dynamic' */
      priceType?: 'static' | 'dynamic'

      /** Minimal sum of item prices inside the bundle when bought alone */
      priceOfItems?: string

      /** Number. Minimal sum of item prices inside the bundle when bought alone */
      priceOfItemsAsNumber?: number

      /** Currency formatted minimal price for this bundle */
      minPrice?: string

      /** Number. Minimal price for this bundle */
      minPriceAsNumber?: number

      /** Currency formatted maximal price for this bundle */
      maxPrice?: string

      /** Number. Maximal price for this bundle */
      maxPriceAsNumber?: number
    }

    /**
     * Bundle object
     */
    interface Bundle {
      /** Bundle information object */
      bundleInfo?: BundleInfo
      sections?: { section?: string; quantity?: number; products?: number[] }[]
    }

    interface SelectionItem {
      /** Item ID */
      item?: string

      /** URL from where the product was added */
      productUrl?: string

      /** Category ID from where the product was added */
      category?: string

      /** Size description */
      size?: string

      /** Product item SKU */
      sku?: string

      /** Product item EAN */
      ean?: string

      /** Number. Quantity for this item */
      quantity?: number

      /** Product item comment */
      comment?: string

      /** Unique id for the selection item */
      line?: string

      /** string. Formatted price with currency prefix/suffix. Price for each item */
      priceEach?: string

      /** number. Price value as a float, example: 14.11. Price for each item */
      priceEachAsNumber?: number

      /** string. Formatted price with currency prefix/suffix. Total price for the total quantity of this item */
      totalPrice?: string

      /** number. Price value as a float, example: 14.11. Total price for the total quantity of this item */
      totalPriceAsNumber?: number

      /** string. Formatted price with currency prefix/suffix. Price for each item before any discount, original price */
      priceEachBeforeDiscount?: string

      /** number. Price value as a float, example: 14.11. Price for each item before any discount, original price */
      priceEachBeforeDiscountAsNumber?: number

      /** If any discount was applied to this item */
      anyDiscount?: boolean

      /** Number. The included tax percentage in the price */
      taxPercent?: number

      /** string. Formatted price with currency prefix/suffix. Price for each item excluding tax */
      priceEachWithoutTax?: string

      /** number. Price value as a float, example: 14.11. Price for each item excluding tax */
      priceEachWithoutTaxAsNumber?: number

      /** string. Formatted price with currency prefix/suffix. Total price for item */
      totalPriceBeforeDiscount?: string

      /** number. Price value as a float, example: 14.11. Total price for item */
      totalPriceBeforeDiscountAsNumber?: number
      product?: SelectionProduct

      /** Contained items of the bundle, if this item is a bundle */
      bundle?: Bundle
    }

    interface SelectionBundle {
      /** Item ID */
      item?: string

      /** URL from where the product was added */
      productUrl?: string

      /** Category ID from where the product was added */
      category?: string

      /** Size description */
      size?: string

      /** Product item SKU */
      sku?: string

      /** Product item EAN */
      ean?: string

      /** Number. Quantity for this item */
      quantity?: number

      /** Product item comment */
      comment?: string

      /** Unique id for the selection item */
      line?: string

      /** string. Formatted price with currency prefix/suffix. Price for each item */
      priceEach?: string

      /** number. Price value as a float, example: 14.11. Price for each item */
      priceEachAsNumber?: number

      /** string. Formatted price with currency prefix/suffix. Total price for the total quantity of this item */
      totalPrice?: string

      /** number. Price value as a float, example: 14.11. Total price for the total quantity of this item */
      totalPriceAsNumber?: number

      /** string. Formatted price with currency prefix/suffix. Price for each item before any discount, original price */
      priceEachBeforeDiscount?: string

      /** number. Price value as a float, example: 14.11. Price for each item before any discount, original price */
      priceEachBeforeDiscountAsNumber?: number

      /** If any discount was applied to this item */
      anyDiscount?: boolean

      /** Number. The included tax percentage in the price */
      taxPercent?: number

      /** string. Formatted price with currency prefix/suffix. Price for each item excluding tax */
      priceEachWithoutTax?: string

      /** number. Price value as a float, example: 14.11. Price for each item excluding tax */
      priceEachWithoutTaxAsNumber?: number

      /** string. Formatted price with currency prefix/suffix. Total price for item */
      totalPriceBeforeDiscount?: string

      /** number. Price value as a float, example: 14.11. Total price for item */
      totalPriceBeforeDiscountAsNumber?: number
      product?: SelectionProduct

      /** Contained items of the bundle, if this item is a bundle */
      bundle?: Bundle
    }

    interface Currency {
      /** Currency code (ISO 4217) */
      currency?: string

      /** Name of currency */
      name?: string

      /** Prefix used for rendering a price */
      prefix?: string

      /** Suffix used for rendering a price */
      suffix?: string

      /** String to separate integers from decimals, default "." */
      decimalPoint?: string

      /** amount of decimals to be rendered */
      decimalDigits?: string

      /** shortname for the currency */
      uri?: string
    }

    /**
     * Current selection
     */
    interface Selection {
      /** HTML needed to inject into the DOM to trigger affiliate tracking scripts */
      affiliateHtml?: string

      /**
       * If order was a gift certificate purchase,
       *             this contains the gift message
       */
      giftMessage?: string

      /** Language ID. Selected language for the current selection */
      language?: string

      /** Currency code (ISO 4217). Currency for the selection */
      currency?: string

      /** Selected payment method id */
      paymentMethod?: string

      /** Selected payment method name */
      paymentMethodName?: string

      /** Selected shipping method id */
      shippingMethod?: string

      /** Selected shipping method name */
      shippingMethodName?: string

      /**
       * Optional. Contains properties added by installed plugins
       *                 <br /><br />Ex: `paymentHTML`, string, optional.
       *                 Current checkout script for current order. Used for KCO/Klarna Checkout
       *                 <br /><br />Ex: `klarnaReplaceSnippet`, boolean, optional. If KCO should be reloaded or not
       *                 <br /><br />Ex: `shipwallet`, object, optional. Used for Ingrid widget
       *                 <br /><br />Ex: `shipwallet_reload`, bool, optional. Used for Ingrid widget
       */
      pluginFields?: PluginFields

      /**
       * Optional. Is added as soon as any installed plugin wants to load it.
       *                 Centra Checkout Script for supporting simple JavaScript hooks
       *                 in checkout process to make sure all payment checkout windows
       *                 are properly reloaded when selection changes
       */
      centraCheckoutScript?: string
      items?: (SelectionItem | SelectionBundle | (SelectionItem & SelectionBundle))[]
      discounts?: {
        anyDiscount?: boolean
        discount?: string
        discountAsNumber?: number
        automaticDiscounts?: {
          automaticDiscount?: boolean
          name?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
        vouchers?: {
          voucher?: string
          type?: 'code' | 'uri' | 'other'
          description?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
      }
      totals?: {
        itemsTotalPrice?: string
        itemsTotalPriceAsNumber?: number
        totalDiscountPrice?: string | boolean
        totalDiscountPriceAsNumber?: number | boolean
        shippingPrice?: string
        shippingPriceAsNumber?: number
        handlingCostAddedToShippingPrice?: boolean
        totalQuantity?: number
        taxDeducted?: string | boolean
        taxDeductedAsNumber?: number | boolean
        taxAdded?: number | boolean
        taxAddedAsNumber?: string | boolean
        taxPercent?: number
        grandTotalPrice?: string
        grandTotalPriceAsNumber?: number
        grandTotalPriceTax?: string
        grandTotalPriceTaxAsNumber?: number
      }

      /** If selection qualifies for VAT exemption */
      vatExempt?: boolean

      /** Additional notes defined on the order */
      additionalNotes?: string
      address?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
        vatNumber?: string
      }
      shippingAddress?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
      }
      currencyFormat?: Currency
    }

    /**
     * Image object used in custom attributes
     */
    interface ImageAttribute {
      width?: string
      height?: string
      mimeType?: string
      type?: string
      url?: string
    }

    /**
     * Generic error response
     */
    interface ErrorResponse {
      token?: string
      errors?: Record<string, string>
    }

    interface Language {
      /** Language ID */
      language?: string

      /** Name of language */
      name?: string

      /** If the language is the default fallback one for the store */
      default?: boolean
    }

    interface PaymentMethod {
      /** Payment Method ID */
      paymentMethod?: string

      /** Name of payment method */
      name?: string
      clientSide?: { externalScript?: string }

      /** string. Formatted price with currency prefix/suffix. Additional cost when using this payment method */
      handlingCost?: string

      /** number. Price value as a float, example: 14.11. Additional cost when using this payment method */
      handlingCostAsNumber?: number

      /** If the address is fetched from the provider, this value will be `true` */
      providesCustomerAddressAfterPayment?: boolean

      /**
       * This value defines the plugin used for the payment method, it can be used to trigger certain
       *                 logic in the checkout for certain plugins, such as `stripe_payment_intents` or `klarna_checkout`.
       */
      paymentMethodType?: string

      /** payment methods supports submitting without full address */
      supportsInitiateOnly?: boolean
    }

    interface PaymentField {
      /** Possible values: 'string', 'boolean'. Type of input */
      type?: 'string' | 'boolean'

      /** If input is visible or not */
      visible?: boolean

      /** If input is required or not */
      required?: boolean
    }

    /**
     * All fields needed for completing checkout process
     */
    interface PaymentFields {
      termsAndConditions?: PaymentField
      address?: {
        email?: PaymentField
        company?: PaymentField
        firstName?: PaymentField
        lastName?: PaymentField
        address1?: PaymentField
        address2?: PaymentField
        zipCode?: PaymentField
        city?: PaymentField
        state?: PaymentField
        country?: PaymentField
        phoneNumber?: PaymentField
        identityNumber?: PaymentField
        vatNumber?: PaymentField
        houseNumber?: PaymentField
        houseExtension?: PaymentField
        newsletter?: PaymentField
      }
      shippingAddress?: {
        email?: PaymentField
        company?: PaymentField
        firstName?: PaymentField
        lastName?: PaymentField
        address1?: PaymentField
        address2?: PaymentField
        zipCode?: PaymentField
        city?: PaymentField
        state?: PaymentField
        country?: PaymentField
        phoneNumber?: PaymentField
        houseNumber?: PaymentField
        houseExtension?: PaymentField
      }
    }

    interface PaymentResponse {
      action?: string
      code?: string
      errors?: Record<string, string>
      formFields?: Record<string, string>
      formHtml?: string
      formType?: string
      formUrl?: string
      token?: string
      url?: string
    }

    /**
     * Optional. Contains properties added by installed plugins
     *                 <br /><br />Ex: `paymentHTML`, string, optional.
     *                 Current checkout script for current order. Used for KCO/Klarna Checkout
     *                 <br /><br />Ex: `klarnaReplaceSnippet`, boolean, optional. If KCO should be reloaded or not
     *                 <br /><br />Ex: `shipwallet`, object, optional. Used for Ingrid widget
     *                 <br /><br />Ex: `shipwallet_reload`, bool, optional. Used for Ingrid widget
     */
    interface PluginFields {
      paymentHTML?: string
      klarnaReplaceSnippet?: string
      shipwallet?: {
        deliveryOptionsAvailable?: boolean
        ingridAttributes?: Record<string, unknown>
        session_id?: string
        snippet?: string
        version?: number
      }
      shipwallet_reload?: boolean
    }

    interface ShippingMethod {
      /** Shipping Method ID */
      shippingMethod?: string

      /** Name of shipping method */
      name?: string

      /** string. Formatted price with currency prefix/suffix. Additional cost when using this shipping method */
      price?: string

      /** number. Price value as a float, example: 14.11. Additional cost when using this shipping method */
      priceAsNumber?: number
    }

    interface CountryShippable {
      /** Country ISO 3166-1 alpha-2, for example SE */
      country?: string

      /** Name of country */
      name?: string

      /** If country is in eu or not */
      eu?: boolean

      /** Language ID */
      language?: string

      /** Currency code (ISO 4217). Preferred currency for this country */
      currency?: string

      /** This property only shows up if the country actually has states. */
      states?: { state?: string; name?: string }[]
    }

    interface LoggedIn {
      /** E-mail address. Current logged in customer's email address */
      email?: string

      /** First name of customer */
      firstName?: string

      /** Last name of customer */
      lastName?: string

      /** Optional. Gender of the customer */
      gender?: string
      address1?: string
      address2?: string
      zipCode?: string
      city?: string

      /**
       * State ISO code, maxlength 6, Example: CA for California (US) and NSW for New South West (AU).
       *         When used as input, the correct description of the state will also be allowed.
       */
      state?: string

      /** Country ISO 3166-1 alpha-2, for example SE */
      country?: string
      phoneNumber?: string

      /** Language ID. Language set for this customer. Could be null */
      language?: string

      /** If customer has registered to newsletter subscription */
      newsletter?: boolean

      /**
       * Optional.
       *             Custom attributes applied to this customer
       */
      [key: string]: Record<string, unknown> | unknown
    }

    interface Location {
      /** Country ISO 3166-1 alpha-2, for example SE */
      country?: string

      /** Name of current country */
      name?: string

      /**
       * State ISO code, maxlength 6, Example: CA for California (US) and NSW for New South West (AU).
       *         When used as input, the correct description of the state will also be allowed.. Current country state
       */
      state?: string

      /** Name of current country state */
      stateName?: string

      /** If current country is in EU */
      eu?: boolean

      /** If current country is shippable */
      shipTo?: boolean

      /** Current language for the session */
      language?: Language

      /** Integer. Current market ID for the session */
      market?: number

      /** Integer. Current pricelist ID for the session */
      pricelist?: number
    }

    interface SelectionResponse {
      /** Token for the current session, maintained by sending it as an API-token header or inside the Accept header. Will be `null` if API-token header value is `none` */
      token?: string

      /** Current selection */
      selection?: Selection

      /** All available languages */
      languages?: Language[]

      /** All available payment methods for current selection */
      paymentMethods?: PaymentMethod[]

      /** All fields needed for completing checkout process */
      paymentFields?: PaymentFields

      /** All available shipping methods for current selection */
      shippingMethods?: ShippingMethod[]

      /** All shippable countries */
      countries?: CountryShippable[]

      /** Optional. If the current session contains a logged in customer */
      loggedIn?: LoggedIn

      /** Current location data for the session */
      location?: Location
    }

    /**
     * Order Complete object
     */
    interface OrderComplete {
      /** Order number */
      order?: string

      /**
       * Possible values: 'untouched', 'progress', 'ok', 'archived', 'failed'. Status for the order.
       *                 Differs depending on how far in the order process the order is
       */
      status?: 'untouched' | 'progress' | 'ok' | 'archived' | 'failed'

      /** Possible values: 'Pending', 'Confirmed', 'Processing', 'Completed', 'Archived', 'Cancelled', 'Incomplete'. Explanation of the order status */
      statusDescription?:
        | 'Pending'
        | 'Confirmed'
        | 'Processing'
        | 'Completed'
        | 'Archived'
        | 'Cancelled'
        | 'Incomplete'

      /** Datetime, "YYYY-MM-DD HH:ii:ss" like "2015-12-24 13:25:01". Order creation date. Timezone is defined by the current Centra instance */
      date?: string

      /**
       * If order was a gift certificate purchase,
       *             this contains the gift message
       */
      giftMessage?: string

      /** Language ID. Selected language for the current selection */
      language?: string

      /** Currency code (ISO 4217). Currency for the selection */
      currency?: string

      /** Selected payment method id */
      paymentMethod?: string

      /** Selected payment method name */
      paymentMethodName?: string

      /** Selected shipping method id */
      shippingMethod?: string

      /** Selected shipping method name */
      shippingMethodName?: string

      /**
       * Optional. Contains properties added by installed plugins
       *                 <br /><br />Ex: `paymentHTML`, string, optional.
       *                 Current checkout script for current order. Used for KCO/Klarna Checkout
       *                 <br /><br />Ex: `klarnaReplaceSnippet`, boolean, optional. If KCO should be reloaded or not
       *                 <br /><br />Ex: `shipwallet`, object, optional. Used for Ingrid widget
       *                 <br /><br />Ex: `shipwallet_reload`, bool, optional. Used for Ingrid widget
       */
      pluginFields?: PluginFields

      /**
       * Optional. Is added as soon as any installed plugin wants to load it.
       *                 Centra Checkout Script for supporting simple JavaScript hooks
       *                 in checkout process to make sure all payment checkout windows
       *                 are properly reloaded when selection changes
       */
      centraCheckoutScript?: string
      items?: (SelectionItem | SelectionBundle | (SelectionItem & SelectionBundle))[]
      discounts?: {
        anyDiscount?: boolean
        discount?: string
        discountAsNumber?: number
        automaticDiscounts?: {
          automaticDiscount?: boolean
          name?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
        vouchers?: {
          voucher?: string
          type?: 'code' | 'uri' | 'other'
          description?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
      }
      totals?: {
        itemsTotalPrice?: string
        itemsTotalPriceAsNumber?: number
        totalDiscountPrice?: string | boolean
        totalDiscountPriceAsNumber?: number | boolean
        shippingPrice?: string
        shippingPriceAsNumber?: number
        handlingCostAddedToShippingPrice?: boolean
        totalQuantity?: number
        taxDeducted?: string | boolean
        taxDeductedAsNumber?: number | boolean
        taxAdded?: number | boolean
        taxAddedAsNumber?: string | boolean
        taxPercent?: number
        grandTotalPrice?: string
        grandTotalPriceAsNumber?: number
        grandTotalPriceTax?: string
        grandTotalPriceTaxAsNumber?: number
      }

      /** If selection qualifies for VAT exemption */
      vatExempt?: boolean

      /** Additional notes defined on the order */
      additionalNotes?: string
      address?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
        vatNumber?: string
      }
      shippingAddress?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
      }
      currencyFormat?: Currency
    }

    interface OrderCompleteResponse {
      /** Token for the current session, maintained by sending it as an API-token header or inside the Accept header. Will be `null` if API-token header value is `none` */
      token?: string

      /** Order Complete object */
      order?: OrderComplete

      /** All available languages */
      languages?: Language[]

      /** All shippable countries */
      countries?: CountryShippable[]

      /** Optional. If the current session contains a logged in customer */
      loggedIn?: LoggedIn

      /** Current location data for the session */
      location?: Location
    }

    interface CountryShippableAuthorized {
      /** Country ISO 3166-1 alpha-2, for example SE */
      country?: string

      /** Name of country */
      name?: string

      /** If country is in eu or not */
      eu?: boolean

      /** Language ID */
      language?: string

      /** Currency code (ISO 4217). Preferred currency for this country */
      currency?: string

      /** This property only shows up if the country actually has states. */
      states?: { state?: string; name?: string }[]

      /** Preferred market for this country. Requires shared secret */
      market?: string

      /** Preferred pricelist for this country. Requires shared secret */
      pricelist?: string
    }

    interface CountryAuthorized {
      /** Country ISO 3166-1 alpha-2, for example SE */
      country?: string

      /** Name of country */
      name?: string

      /** If country is in eu or not */
      eu?: boolean

      /** If country is allowed to be shipped to */
      shipTo?: boolean

      /** Language ID */
      language?: string

      /** Currency code (ISO 4217). Preferred currency for this country */
      currency?: string

      /** This property only shows up if the country actually has states. */
      states?: { state?: string; name?: string }[]

      /** Preferred market for this country. Requires shared secret */
      market?: string

      /** Preferred pricelist for this country. Requires shared secret */
      pricelist?: string
    }

    interface Market {
      /** If market is default */
      default?: boolean
      /** Market ID */
      market?: string
      /** Name of market */
      name?: string
    }

    /**
     * Order Created object
     */
    interface OrderCreated {
      /** Order number */
      order?: string

      /**
       * Possible values: 'untouched', 'progress', 'ok', 'archived', 'failed'. Status for the order.
       *                 Differs depending on how far in the order process the order is
       */
      status?: 'untouched' | 'progress' | 'ok' | 'archived' | 'failed'

      /** Possible values: 'Pending', 'Confirmed', 'Processing', 'Completed', 'Archived', 'Cancelled', 'Incomplete'. Explanation of the order status */
      statusDescription?:
        | 'Pending'
        | 'Confirmed'
        | 'Processing'
        | 'Completed'
        | 'Archived'
        | 'Cancelled'
        | 'Incomplete'

      /** Datetime, "YYYY-MM-DD HH:ii:ss" like "2015-12-24 13:25:01". Order creation date. Timezone is defined by the current Centra instance */
      date?: string

      /** HTML needed to inject into the DOM to trigger affiliate tracking scripts */
      affiliateHtml?: string

      /**
       * If order was a gift certificate purchase,
       *             this contains the gift message
       */
      giftMessage?: string

      /** Language ID. Selected language for the current selection */
      language?: string

      /** Currency code (ISO 4217). Currency for the selection */
      currency?: string

      /** Selected payment method id */
      paymentMethod?: string

      /** Selected payment method name */
      paymentMethodName?: string

      /** Selected shipping method id */
      shippingMethod?: string

      /** Selected shipping method name */
      shippingMethodName?: string

      /**
       * Optional. Contains properties added by installed plugins
       *                 <br /><br />Ex: `paymentHTML`, string, optional.
       *                 Current checkout script for current order. Used for KCO/Klarna Checkout
       *                 <br /><br />Ex: `klarnaReplaceSnippet`, boolean, optional. If KCO should be reloaded or not
       *                 <br /><br />Ex: `shipwallet`, object, optional. Used for Ingrid widget
       *                 <br /><br />Ex: `shipwallet_reload`, bool, optional. Used for Ingrid widget
       */
      pluginFields?: PluginFields

      /**
       * Optional. Is added as soon as any installed plugin wants to load it.
       *                 Centra Checkout Script for supporting simple JavaScript hooks
       *                 in checkout process to make sure all payment checkout windows
       *                 are properly reloaded when selection changes
       */
      centraCheckoutScript?: string
      items?: (SelectionItem | SelectionBundle | (SelectionItem & SelectionBundle))[]
      discounts?: {
        anyDiscount?: boolean
        discount?: string
        discountAsNumber?: number
        automaticDiscounts?: {
          automaticDiscount?: boolean
          name?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
        vouchers?: {
          voucher?: string
          type?: 'code' | 'uri' | 'other'
          description?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
      }
      totals?: {
        itemsTotalPrice?: string
        itemsTotalPriceAsNumber?: number
        totalDiscountPrice?: string | boolean
        totalDiscountPriceAsNumber?: number | boolean
        shippingPrice?: string
        shippingPriceAsNumber?: number
        handlingCostAddedToShippingPrice?: boolean
        totalQuantity?: number
        taxDeducted?: string | boolean
        taxDeductedAsNumber?: number | boolean
        taxAdded?: number | boolean
        taxAddedAsNumber?: string | boolean
        taxPercent?: number
        grandTotalPrice?: string
        grandTotalPriceAsNumber?: number
        grandTotalPriceTax?: string
        grandTotalPriceTaxAsNumber?: number
      }

      /** If selection qualifies for VAT exemption */
      vatExempt?: boolean

      /** Additional notes defined on the order */
      additionalNotes?: string
      address?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
        vatNumber?: string
      }
      shippingAddress?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
      }
      currencyFormat?: Currency
    }

    interface OrderCreatedDirectlyResponse {
      /** Possible values: 'success'. Order was successfully completed */
      action?: 'success'

      /** Token for the current session, maintained by sending it as an API-token header or inside the Accept header. Will be `null` if API-token header value is `none` */
      token?: string

      /** Order Created object */
      order?: OrderCreated

      /** All available languages */
      languages?: Language[]

      /** All shippable countries */
      countries?: CountryShippable[]

      /** Optional. If the current session contains a logged in customer */
      loggedIn?: LoggedIn

      /** Current location data for the session */
      location?: Location
    }

    interface Pricelist {
      pricelist?: string
      name?: string
      default?: boolean
      currency: Currency
    }

    interface PricelistsResponse {
      token?: string
      pricelists?: Pricelist[]
    }

    interface Product {
      /** If any item for this product is available for purchase */
      available?: boolean

      /**
       * Optional. If the product has relations.
       *                     If `relatedProducts=true` the full ProductForRelated is used, else
       *                     a small object containing information about the related product and its availability is shown
       */
      relatedProducts?: (
        | RelatedProduct
        | {
            product?: string
            available?: boolean
            media?: Record<string, string[]>
            relation?: string | string | string
          }
      )[]

      /** Optional. Removed if `measurementChart=false` for product list, always on single product view. */
      measurementChart?: {
        unit?: string
        contents?: { content?: string; x?: number; y?: number }[]
        x?: string[]
        y?: string[]
      }

      /** Bundle info (if product is a bundle) */
      bundleInfo?: BundleInfo

      /** Product Display Item ID */
      product?: string

      /** Product Display Name */
      name?: string

      /** Product URI. Unique URI for the product */
      uri?: string

      /** The specific variant SKU (Either only Product or a combination of Product+Variant) */
      sku?: string

      /** Product SKU */
      productSku?: string

      /** Brand ID */
      brand?: string

      /** Brand name */
      brandName?: string

      /** Brand URI. Unique URI for the brand */
      brandUri?: string

      /** Collection ID */
      collection?: string

      /** Collection name */
      collectionName?: string

      /** Collection URI. Unique URI for the collection */
      collectionUri?: string

      /** Variant Name */
      variantName?: string

      /** Country ISO 3166-1 alpha-2, for example SE. Product Origin */
      countryOfOrigin?: string

      /** Short description of the product */
      excerpt?: string

      /** Short description of the product, formatted as HTML */
      excerptHtml?: string

      /** Description of the product */
      description?: string

      /** Description of the product, formatted as HTML */
      descriptionHtml?: string

      /** Meta title for the product page */
      metaTitle?: string

      /** Meta description for the product page */
      metaDescription?: string

      /** Meta keywords for the product page */
      metaKeywords?: string

      /** The stock unit for this product, default empty */
      stockUnit?: string

      /** Category ID for the canonical category */
      category?: string

      /** Category name for the canonical category, each sub category name as an element. Root category first. */
      categoryName?: string[]

      /** Date of creation */
      createdAt?: string

      /** Date of modification */
      modifiedAt?: string

      /** Category URI for the canonical category */
      categoryUri?: string

      /** Product ID in Centra */
      centraProduct?: string

      /** Variant ID in Centra */
      centraVariant?: string

      /** Number. Default 1, minimum allowed quantity for purchase */
      itemQuantityMinimum?: number

      /** Number. Default 1, allowed quantity multiple for purchase */
      itemQuantityMultipleOf?: number

      /** string. Formatted price with currency prefix/suffix. Price for the product */
      price?: string

      /** number. Price value as a float, example: 14.11. Price for the product */
      priceAsNumber?: number

      /** string. Formatted price with currency prefix/suffix. Price before discount */
      priceBeforeDiscount?: string

      /** number. Price value as a float, example: 14.11. Price before discount */
      priceBeforeDiscountAsNumber?: number

      /** Number. Percent of discount on this product's price */
      discountPercent?: number

      /** If product should be marked with sale */
      showAsOnSale?: boolean

      /** If product should be marked with new */
      showAsNew?: boolean

      /** Size table to sort sizes properly, supports both X and Y axes */
      itemTable?: { unit?: string; x?: string[]; y?: string[]; dividerSymbol?: string }
      items?: {
        item?: string
        ean?: string
        sizeId?: string
        itemTableX?: number
        itemTableY?: number
        name?: string
        sku?: string
        stock?: 'preorder' | 'infinite' | 'yes' | 'no' | 'few' | number | string
        warehouses?: { warehouse?: number; stock?: number }[]
      }[]
      categories?: CategoryForProduct[]

      /** For each image size key, an array with URLs to the images for the product */
      media?: Record<string, string[]>

      /** If product is in preview mode or not */
      preview?: boolean

      /** What type of relation type this product has. Default is `variant` */
      relation?: string | string | string

      /**
       * Optional.
       *                 Custom attributes applied to this product and exposed in the Checkout plugin settings
       */
      [key: string]: Record<string, unknown> | unknown
    }

    interface Product {
      /**
       * Optional. If `pricelist=all`.
       * Object with Pricelist ID as the key, for each pricelist the product is in
       */
      prices?: Record<
        string,
        {
          price?: string
          priceAsNumber?: number
          priceBeforeDiscount?: string
          priceBeforeDiscountAsNumber?: number
          discountPercent?: number
          showAsOnSale?: boolean
          showAsNew?: boolean
        }
      >
    }

    interface Product {
      /** Integer. Optional. If `market=all`. List of the Market IDs the product is available in */
      markets?: number[]
    }

    type RelatedProduct = Omit<Product, 'relatedProducts'>

    type SelectionProduct = Omit<Product, 'available' | 'prices' | 'markets'>

    interface OrderCreatedResponse {
      /** Token for the current session, maintained by sending it as an API-token header or inside the Accept header. Will be `null` if API-token header value is `none` */
      token?: string

      /** Order Created object */
      order?: OrderCreated

      /** All available languages */
      languages?: Language[]

      /** All shippable countries */
      countries?: CountryShippable[]

      /** Optional. If the current session contains a logged in customer */
      loggedIn?: LoggedIn

      /** Current location data for the session */
      location?: Location
    }

    /**
     * Order object
     */
    interface Order {
      /** Order number */
      order?: string

      /**
       * Possible values: 'untouched', 'progress', 'ok', 'archived', 'failed'. Status for the order.
       *                 Differs depending on how far in the order process the order is
       */
      status?: 'untouched' | 'progress' | 'ok' | 'archived' | 'failed'

      /** Possible values: 'Pending', 'Confirmed', 'Processing', 'Completed', 'Archived', 'Cancelled', 'Incomplete'. Explanation of the order status */
      statusDescription?:
        | 'Pending'
        | 'Confirmed'
        | 'Processing'
        | 'Completed'
        | 'Archived'
        | 'Cancelled'
        | 'Incomplete'

      /** Datetime, "YYYY-MM-DD HH:ii:ss" like "2015-12-24 13:25:01". Order creation date. Timezone is defined by the current Centra instance */
      date?: string

      /**
       * If order was a gift certificate purchase,
       *             this contains the gift message
       */
      giftMessage?: string
      shipments?: {
        shipmentId?: string
        shippedDate?: string
        carrier?: string
        service?: string
        trackingId?: string
        trackingUrl?: string
        returnSlipTracking?: string
        additionalMessage?: string
      }[]

      /** Language ID. Selected language for the current selection */
      language?: string

      /** Currency code (ISO 4217). Currency for the selection */
      currency?: string

      /** Selected payment method id */
      paymentMethod?: string

      /** Selected payment method name */
      paymentMethodName?: string

      /** Selected shipping method id */
      shippingMethod?: string

      /** Selected shipping method name */
      shippingMethodName?: string

      /**
       * Optional. Contains properties added by installed plugins
       *                 <br /><br />Ex: `paymentHTML`, string, optional.
       *                 Current checkout script for current order. Used for KCO/Klarna Checkout
       *                 <br /><br />Ex: `klarnaReplaceSnippet`, boolean, optional. If KCO should be reloaded or not
       *                 <br /><br />Ex: `shipwallet`, object, optional. Used for Ingrid widget
       *                 <br /><br />Ex: `shipwallet_reload`, bool, optional. Used for Ingrid widget
       */
      pluginFields?: PluginFields

      /**
       * Optional. Is added as soon as any installed plugin wants to load it.
       *                 Centra Checkout Script for supporting simple JavaScript hooks
       *                 in checkout process to make sure all payment checkout windows
       *                 are properly reloaded when selection changes
       */
      centraCheckoutScript?: string
      items?: (SelectionItem | SelectionBundle | (SelectionItem & SelectionBundle))[]
      discounts?: {
        anyDiscount?: boolean
        discount?: string
        discountAsNumber?: number
        automaticDiscounts?: {
          automaticDiscount?: boolean
          name?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
        vouchers?: {
          voucher?: string
          type?: 'code' | 'uri' | 'other'
          description?: string
          priceOff?: string
          priceOffAsNumber?: number
        }[]
      }
      totals?: {
        itemsTotalPrice?: string
        itemsTotalPriceAsNumber?: number
        totalDiscountPrice?: string | boolean
        totalDiscountPriceAsNumber?: number | boolean
        shippingPrice?: string
        shippingPriceAsNumber?: number
        handlingCostAddedToShippingPrice?: boolean
        totalQuantity?: number
        taxDeducted?: string | boolean
        taxDeductedAsNumber?: number | boolean
        taxAdded?: number | boolean
        taxAddedAsNumber?: string | boolean
        taxPercent?: number
        grandTotalPrice?: string
        grandTotalPriceAsNumber?: number
        grandTotalPriceTax?: string
        grandTotalPriceTaxAsNumber?: number
      }

      /** If selection qualifies for VAT exemption */
      vatExempt?: boolean

      /** Additional notes defined on the order */
      additionalNotes?: string
      address?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
        vatNumber?: string
      }
      shippingAddress?: {
        email?: string
        firstName?: string
        lastName?: string
        company?: string
        address1?: string
        address2?: string
        zipCode?: string
        city?: string
        state?: string
        country?: string
        countryName?: string
        phoneNumber?: string
      }
      currencyFormat?: Currency
    }

    interface OrdersResponse {
      /** Token for the current session, maintained by sending it as an API-token header or inside the Accept header. Will be `null` if API-token header value is `none` */
      token?: string
      orders?: Order[]
      ordersPaging?: { from?: number; size?: number; totalSize?: number }

      /** All available languages */
      languages?: Language[]

      /** All shippable countries */
      countries?: CountryShippable[]

      /** Optional. If the current session contains a logged in customer */
      loggedIn?: LoggedIn

      /** Current location data for the session */
      location?: Location
    }

    /**
     * Collection object
     */
    interface Collection {
      /** Collection ID */
      collection?: string

      /** URI of the collection */
      uri?: string

      /** Collection name */
      name?: string
    }

    /**
     * Category object
     */
    interface Category {
      /** Category ID */
      category?: string

      /** Each sub category name as an element. Root category first. */
      name?: string[]

      /** Full category URI */
      uri?: string

      /** Optional. Category ID for the parent category if there is one */
      inCategory?: string

      /** Meta keywords for the category */
      metaKeywords?: string

      /** Meta title for the category */
      metaTitle?: string

      /** Meta description for the category */
      metaDescription?: string
    }

    /**
     * Brand object
     */
    interface Brand {
      /** Brand ID */
      brand?: string

      /** URI of the brand */
      uri?: string

      /** Brand name */
      name?: string

      /** Meta keywords for the brand */
      metaKeywords?: string

      /** Meta title for the brand */
      metaTitle?: string

      /** Meta description for the brand */
      metaDescription?: string
    }

    /**
     * CMS article object
     */
    interface CmsArticle {
      /** Article ID */
      article?: string

      /** Main title of the article */
      title?: string

      /** Title used for listings */
      listTitle?: string

      /** URL for image used for listings */
      listImage?: string

      /** URI for the CMS article */
      uri?: string

      /** Datetime, "YYYY-MM-DD HH:ii:ss" like "2015-12-24 13:25:01". Published date */
      date?: string

      /** Author of the article */
      author?: string

      /** Name of author */
      authorName?: string

      /** Author description */
      authorDescription?: string

      /** URL for image of author */
      authorImageUrl?: string

      /** Section ID. Default is `pages` */
      section?: string

      /** URI for the section. If section is `pages` this URI is empty */
      sectionUri?: string
      metaKeywords?: string
      metaDescription?: string

      /** Text used for pre-heading */
      preHeading?: string

      /** Text used for sub-heading */
      subHeading?: string
      tags?: string[]

      /** Integer. List of CMS Article IDs that this article relates to */
      relatedArticles?: number[]

      /** Deprecated, do not use */
      products?: { deprecated?: string }[]
      brands?: { brand?: string; name?: string }[]
      categories?: { category?: string; name?: string }[]

      /**
       * Sorted parts to render this CMS article, based on the configuration in Centra for
       *                 templates, with dynamic properties
       */
      parts?: {
        template?: string
        slots?: {
          type?:
            | 'textfield'
            | 'image'
            | 'slideshow'
            | 'products'
            | 'file'
            | 'files'
            | 'boolean'
            | 'option'
            | 'date'
            | 'campaign'
            | 'articlerelation'
            | 'origin'
          products?: { slotDescription?: string; product?: Product }[]
        }
      }[]
    }

    /**
     * Warehouse object
     */
    interface Warehouse {
      /** Warehouse ID */
      warehouse?: string

      /** Warehouse name */
      name?: string
    }

    /**
     * Requires shared secret. Lists products with multiple pricelists/markets
     */
    interface BundleInfoAll {
      /**
       * Optional. If `pricelist=all`.
       *                         Object with Pricelist ID as the key, for each pricelist the product is in
       */
      prices?: {
        priceList?: number
        priceOfItems?: string
        priceOfItemsAsNumber?: number
        priceMin?: string
        priceMinAsNumber?: number
        priceMax?: string
        priceMaxAsNumber?: number
      }[]

      /** Integer. Optional. If `market=all`. List of the Market IDs the product is available in */
      markets?: number[]

      /** Integer. bundle id */
      bundle?: number

      /** Possible values: 'fixed', 'flexible' */
      type?: 'fixed' | 'flexible'

      /** Possible values: 'static', 'dynamic' */
      priceType?: 'static' | 'dynamic'
    }

    /**
     * Requires shared secret. Lists products with multiple pricelists/markets
     */
    interface BundleAll {
      /**
       * Optional. If `pricelist=all`.
       *                         Object with Pricelist ID as the key, for each pricelist the product is in
       */
      prices?: {
        '*PricelistID*'?: {
          price?: string
          priceAsNumber?: number
          priceBeforeDiscount?: string
          priceBeforeDiscountAsNumber?: number
          discountPercent?: number
          showAsOnSale?: boolean
          showAsNew?: boolean
        }
      }

      /** Integer. Optional. If `market=all`. List of the Market IDs the product is available in */
      markets?: number[]

      /** Requires shared secret. Lists products with multiple pricelists/markets */
      bundleInfo?: BundleInfoAll
      sections?: { section?: string; quantity?: number; products?: number[] }[]
    }

    /**
     * Brick and mortar object
     */
    interface BrickAndMortar {
      /** Integer. Brick and mortar ID */
      brickAndMortar?: number

      /** Brick and mortar  Name */
      name?: string

      /** longitude of brick and mortar */
      longitude?: string

      /** latitude of brick and mortar */
      latitude?: string

      /** brick and mortar country */
      country?: string

      /** brick and mortar country code */
      countryCode?: string

      /** brick and mortar state (if applicable) */
      state?: string

      /** brick and mortar state code (if applicable) */
      stateCode?: string

      /** brick and mortar type (one off 1,2,3) */
      type?: string
    }

    /**
     * Brick and mortar object
     */
    interface BrickAndMortarAuth {
      /** Integer. Brick and mortar ID */
      brickAndMortar?: number

      /** Brick and mortar  Name */
      name?: string

      /** longitude of brick and mortar */
      longitude?: string

      /** latitude of brick and mortar */
      latitude?: string

      /** brick and mortar country */
      country?: string

      /** brick and mortar country code */
      countryCode?: string

      /** brick and mortar state (if applicable) */
      state?: string

      /** brick and mortar state code (if applicable) */
      stateCode?: string

      /** brick and mortar type (one off 1,2,3) */
      type?: string

      /** Integer. Allocation rule ID connected to brick and mortar */
      allocationRule?: number

      /** Integer. Warehouse ID connected to brick and mortar */
      warehouse?: number
    }
  }
}
