export interface Address {
  address1?: string
  address2?: string
  city?: string
  company?: string
  country?: string
  email?: string
  firstName?: string
  identityNumber?: string
  lastName?: string
  newsletter?: boolean
  phoneNumber?: string
  state?: string
  vatNumber?: string
  zipCode?: string
}

export type ShippingAddress = Omit<Address, 'vatNumber' | 'newsletter' | 'identityNumber'>
