import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { SxProps } from '@mui/system'
import { TransitionProps } from '@mui/material/transitions'

export interface ImageZoomTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    children: React.ReactNode
    magnitute?: number
    onZoomIn?: () => void
    onZoomOut?: () => void
    sx?: SxProps
    TransitionComponent?: React.JSXElementConstructor<
      TransitionProps & { children?: React.ReactElement }
    >
    TransitionProps?: TransitionProps
  }
  defaultComponent: D
}

export type ImageZoomProps<
  D extends React.ElementType = ImageZoomTypeMap['defaultComponent'],
  P = { component?: D },
> = OverrideProps<ImageZoomTypeMap<P, D>, D>
