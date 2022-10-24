import * as React from 'react'
import {
  OverridableComponent,
  OverrideProps,
  OverridableTypeMap,
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

// export interface MediaTypeMap<P = {}, D extends React.ElementType = 'img'> {
//   props: P &
//     MediaBaseProps & {
//       breakpoints?: MediaPictureBreakpoints
//       generatePreload?: (data: MediaPreloadData) => React.ReactNode
//       placeholder?: string
//       priority?: boolean
//       rootMargin?: string
//     }
//   defaultComponent: D
// }
// export type MediaBreakpoints<D extends React.ElementType> = D extends 'picture'
//   ? {
//       component?: D
//       breakpoints?: MediaPictureBreakpoints
//     }
//   : {
//       component?: D
//       breakpoints?: MediaWithWidthBreakpoints
//     }

// export function isPicture(props: MediaProps | MediaWithWidthProps): props is MediaProps {
//   return typeof props.component === 'string' && props.component === 'picture'
// }

// export type MediaBreakpoints<C = 'string'> = C extends 'picture'
//   ? {
//       component: C
//       breakpoints?: MediaPictureBreakpoints
//     }
//   : {
//       breakpoints?: MediaWithWidthBreakpoints
//     }
// export type MediaBreakpoints = {
//   breakpoints?: MediaPictureBreakpoints | MediaWithWidthBreakpoints
// }

export interface MediaTypeMap<P = {}, D extends React.ElementType = 'img'> {
  props: P &
    MediaBaseProps &
    (
      | { component: 'picture'; breakpoints?: MediaPictureBreakpoints }
      | {
          component: 'audio' | 'img' | 'video'
          breakpoints?: MediaWithWidthBreakpoints
        }
    ) & {
      generatePreload?: (data: MediaPreloadData) => React.ReactNode
      placeholder?: string
      priority?: boolean
      rootMargin?: string
    }
  defaultComponent: D
}

export interface ExtendMediaTypeMap<M extends OverridableTypeMap> {
  props: M['props'] &
    (
      | { component: 'picture'; breakpoints?: MediaPictureBreakpoints }
      | {
          component: 'audio' | 'img' | 'video'
          breakpoints?: MediaWithWidthBreakpoints
        }
    )
  // (M['props'] extends { component?: React.ElementType<HTMLPictureElement | 'picture'> }
  //   ? MediaTypeMap['props'] & { breakpoints?: MediaPictureBreakpoints }
  //   : MediaTypeMap['props'] & { breakpoints?: MediaWithWidthBreakpoints })
  defaultComponent: M['defaultComponent']
}

export type MediaProps<
  D extends React.ElementType = MediaTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<MediaTypeMap<P, D>, D>

export type ExtendMedia<M extends OverridableTypeMap> = ((
  // props: { component: 'picture' } & OverrideProps<ExtendMediaTypeMap<M>, 'picture'>,
  props: M['props'] &
    (
      | { component: 'picture'; breakpoints?: MediaPictureBreakpoints }
      | {
          component: 'audio' | 'img' | 'video'
          breakpoints?: MediaWithWidthBreakpoints
        }
    ),
) => JSX.Element) &
  OverridableComponent<ExtendMediaTypeMap<M>>
