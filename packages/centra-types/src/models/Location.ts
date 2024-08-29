import { Language } from './Language'

export interface Location {
  country?: string
  eu?: boolean
  language?: Language
  market?: string
  name?: string
  pricelist?: number
  shipTo?: boolean
  state?: string | null
  stateName?: string
}
