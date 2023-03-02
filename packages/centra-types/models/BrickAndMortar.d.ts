export interface DayTime {
  day?: number | null
  time?: string | null
}

export interface OpeningHours {
  periods?: { open?: DayTime | null; close?: DayTime | null }[] | null
  weekday_text?: string[] | null
}

export default interface BrickAndMortar {
  brickAndMortar?: number | null
  name?: string | null
  websiteUrl?: string | null
  address?: string | null
  longitude?: string | null
  latitude?: string | null
  country?: string | null
  countryCode?: string | null
  state?: string | null
  stateCode?: string | null
  type?: {
    type?: number | null
    name?: string | null
  } | null
  openingHours?: OpeningHours | null
  specialOpeningHours?: (OpeningHours & { date?: string | null; timeText?: string | null }) | null
  email?: string | null
  phone?: string | null
}

export interface BrickAndMortarAuthorized extends BrickAndMortar {
  warehouse?: number | null
  allocationRule?: number | null
}
