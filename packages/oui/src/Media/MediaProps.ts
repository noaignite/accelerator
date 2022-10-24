import * as React from 'react'
import {
  // DistributiveOmit,
  OverridableComponent,
  OverridableTypeMap,
  OverrideProps,
  // ...
} from '@mui/types'
import { MediaBaseProps } from '../MediaBase/MediaBaseProps'
import {
  MediaWithWidthBreakpoints,
  //   MediaWithWidthProps,
} from '../MediaWithWidth/MediaWithWidthProps'

export type MediaPictureBreakpoint =
  | string
  | React.SourceHTMLAttributes<HTMLSourceElement>
  | React.SourceHTMLAttributes<HTMLSourceElement>[]

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
      // | 'picture'
      // | (React.ComponentClass<any, any> & 'picture')
      // | (React.FunctionComponent<any> & 'picture')
      breakpoints?: MediaPictureBreakpoints
    }
  | {
      breakpoints?: MediaWithWidthBreakpoints
    }

export interface MediaTypeMap<P = {}, D extends React.ElementType = 'img'> {
  props: P &
    MediaBreakpoints & {
      // MediaBaseProps &
      generatePreload?: (data: MediaPreloadData) => React.ReactNode
      placeholder?: string
      priority?: boolean
      rootMargin?: string
    }
  defaultComponent: D
}
// export interface MediaTypeMap<P = {}, D extends React.ElementType = 'img'> {
//   props: P &
//     (
//       | {
//           breakpoints?: MediaPictureBreakpoints
//           component: 'picture'
//           generatePreload?: (data: MediaPreloadData) => React.ReactNode
//           placeholder?: string
//           priority?: boolean
//           rootMargin?: string
//         }
//       | {
//           breakpoints?: MediaWithWidthBreakpoints
//           generatePreload?: (data: MediaPreloadData) => React.ReactNode
//           placeholder?: string
//           priority?: boolean
//           rootMargin?: string
//         }
//     )
//   defaultComponent: D
// }

export type MediaProps<
  D extends React.ElementType = MediaTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<MediaTypeMap<P, D>, D>

// Trying out dynamic types without success
// ------------------------------------

// export interface ExtendMediaTypeMap<M extends OverridableTypeMap> {
//   props: M['props'] &
//     (M['props'] extends { component?: 'picture' }
//       ? MediaTypeMap['props'] & { breakpoints?: MediaPictureBreakpoints }
//       : MediaTypeMap['props'] & { breakpoints?: MediaWithWidthBreakpoints })
//   defaultComponent: M['defaultComponent']
// }

// export type ExtendMedia<M extends OverridableTypeMap> = ((
//   props: { component: 'picture' } & OverrideProps<ExtendMediaTypeMap<M>, 'picture'>,
// ) => JSX.Element) &
//   OverridableComponent<ExtendMediaTypeMap<M>>
