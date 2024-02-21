export interface State {
  state?: string | null
  name?: string | null
}

export default interface Country {
  country?: string | null
  name?: string | null
  eu?: boolean | null
  language?: string | null
  states?: State[]
  currency?: string | null
}

export interface CountryAuthorized extends Country {
  pricelist?: string | null
  market?: string | null
}
