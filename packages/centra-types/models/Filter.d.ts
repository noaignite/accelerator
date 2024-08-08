export default interface Filter {
  field?: string
  values?: FilterValue[]
}

export interface FilterValue {
  value?: string
  count?: number
  filterCount?: number
  totalCount?: number
  data?: string | Record<string, string | string[]>
}
