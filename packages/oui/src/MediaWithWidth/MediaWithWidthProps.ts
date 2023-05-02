import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { MediaBaseProps } from '../MediaBase'

export type MediaWithWidthBreakpoint = string | MediaBaseProps<'img'> | MediaBaseProps<'video'>

// TODO: how to solve with generic?
// export type MediaWithWidthBreakpoint<T extends React.ElementType = 'img'> =
//   | string
//   | ({ component?: T } & MediaBaseProps<T>)

export type MediaWithWidthBreakpoints = {
  xs: MediaWithWidthBreakpoint
  sm?: MediaWithWidthBreakpoint
  md?: MediaWithWidthBreakpoint
  lg?: MediaWithWidthBreakpoint
  xl?: MediaWithWidthBreakpoint
}

export interface MediaWithWidthTypeMap<P = {}, D extends React.ElementType = 'img'> {
  props: P &
    MediaBaseProps & {
      breakpoints?: MediaWithWidthBreakpoints
    }
  defaultComponent: D
}

export type MediaWithWidthProps<
  D extends React.ElementType = MediaWithWidthTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<MediaWithWidthTypeMap<P, D>, D>
