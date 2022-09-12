import * as React from 'react'
import { SxProps } from '@mui/system'
import { OverrideProps } from '@mui/types'

export interface AspectRatioTypeMap<
  P = Record<string, unknown>,
  D extends React.ElementType = 'div',
> {
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
