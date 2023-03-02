import Language from './Language'

export default interface Location {
  country?: string
  name?: string
  state?: string
  stateName?: string
  eu?: boolean
  shipTo?: boolean
  language?: Language
}
