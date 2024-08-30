export interface PaymentMethod {
  paymentMethod?: string
  name?: string
  handlingCost?: string
  handlingCostAsNumber?: number
  supportsInitiateOnly?: boolean
  providesCustomerAddressAfterPayment?: boolean
}
