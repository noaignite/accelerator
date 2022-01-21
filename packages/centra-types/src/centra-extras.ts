import { PaymentMethodModel, SelectionResponse } from './centra'

// this file is necessary because a few types seem to be missing from Centras swagger api specification

export interface PaymentMethodModelExtended extends PaymentMethodModel {
  /** payment methods supports submitting without full address */
  supportsInitiateOnly?: boolean
}

export interface PaymentResponse {
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

export interface SelectionResponseExtended extends SelectionResponse {
  /** All available payment methods for current selection */
  paymentMethods?: PaymentMethodModelExtended[]
}
