export default interface Address {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  company?: string
  address1?: string
  address2?: string
  zipCode?: string
  city?: string
  state?: string
  country?: string
  vatNumber?: string
}

export type ShippingAddress = Omit<Address, 'vatNumber'>
