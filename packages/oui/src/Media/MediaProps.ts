import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { MediaBaseProps } from '../MediaBase'
import { MediaWithWidthBreakpoints } from '../MediaWithWidth'

export type MediaPictureBreakpoint = string | React.SourceHTMLAttributes<HTMLSourceElement>

export type MediaPictureBreakpoints = {
  xs: MediaPictureBreakpoint
  sm?: MediaPictureBreakpoint
  md?: MediaPictureBreakpoint
  lg?: MediaPictureBreakpoint
  xl?: MediaPictureBreakpoint
}

export type MediaPreloadType = 'audio' | 'image' | 'video'

export type MediaPreloadData = {
  mediaType: MediaPreloadType
  sources?: {
    media: string
    src: string
  }[]
  src?: string
}

export type MediaBreakpoints =
  | {
      component: 'picture'
      breakpoints?: MediaPictureBreakpoints
    }
  | {
      breakpoints?: MediaWithWidthBreakpoints
    }

export interface MediaTypeMap<P = {}, D extends React.ElementType = 'img'> {
  props: P &
    MediaBaseProps &
    MediaBreakpoints & {
      generatePreload?: (data: MediaPreloadData) => React.ReactNode
      priority?: boolean
      rootMargin?: string
    }
  defaultComponent: D
}

export type MediaProps<
  D extends React.ElementType = MediaTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<MediaTypeMap<P, D>, D>
