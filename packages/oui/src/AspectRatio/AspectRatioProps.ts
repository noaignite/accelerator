import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { SxProps } from '@mui/system'

export interface AspectRatioTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    children?: React.ReactNode
    height?: number | string
    ratio?: boolean | number | string
    sx?: SxProps
    width?: number | string
  }
  defaultComponent: D
}

export type AspectRatioProps<
  D extends React.ElementType = AspectRatioTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<AspectRatioTypeMap<P, D>, D>
