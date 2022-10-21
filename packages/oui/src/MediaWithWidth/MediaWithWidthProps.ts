import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { MediaBaseProps } from '../MediaBase/MediaBaseProps'

export type MediaWithWidthBreakpoint = string | MediaBaseProps

export type MediaWithWidthBreakpoints = {
  xs: MediaWithWidthBreakpoint
  sm?: MediaWithWidthBreakpoint
  md?: MediaWithWidthBreakpoint
  lg?: MediaWithWidthBreakpoint
  xl?: MediaWithWidthBreakpoint
}

export interface MediaWithWidthTypeMap<P = {}, D extends React.ElementType = 'img'> {
  props: P & // MediaBaseProps &
  {
    breakpoints?: MediaWithWidthBreakpoints
  }
  defaultComponent: D
}

export type MediaWithWidthProps<
  D extends React.ElementType = MediaWithWidthTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<MediaWithWidthTypeMap<P, D>, D>
