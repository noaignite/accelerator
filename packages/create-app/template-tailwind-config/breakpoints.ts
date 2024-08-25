import { pxToRem } from './utils'

const keys = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const values = {
  xs: pxToRem(640),
  sm: pxToRem(768),
  md: pxToRem(1024),
  lg: pxToRem(1280),
  xl: pxToRem(1536),
} as const

export type Breakpoint = (typeof keys)[number]

export interface Breakpoints {
  keys: typeof keys
  /**
   * Each breakpoint (a key) matches with a fixed viewport width (a value).
   */
  values: typeof values
  /**
   * @param key - A breakpoint key (`xs`, `sm`, etc.) or a viewport width number in px.
   * @returns A media query string ready to be used with most styling solutions, which matches viewport widths greater than the viewport size given by the breakpoint key (inclusive).
   */
  up: (key: Breakpoint | number) => string
  /**
   * @param key - A breakpoint key (`xs`, `sm`, etc.) or a viewport width number in px.
   * @returns A media query string ready to be used with most styling solutions, which matches viewport widths less than the viewport size given by the breakpoint key (exclusive).
   */
  down: (key: Breakpoint | number) => string
}

export const breakpoints: Breakpoints = {
  keys,
  values,
  up: (key) => {
    const value = typeof key === 'number' ? key : values[key]
    return `(min-width: ${value}rem)`
  },
  down: (key) => {
    const value = typeof key === 'number' ? key : values[key]
    return `(max-width: ${value - pxToRem(0.05)}rem)`
  },
}
