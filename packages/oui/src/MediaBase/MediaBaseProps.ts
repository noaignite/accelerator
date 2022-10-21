import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { SxProps } from '@mui/system'

export interface MediaBaseTypeMap<P = {}, D extends React.ElementType = 'img'> {
  props: P & {
    children?: React.ReactNode
    // component?: React.ElementType // @todo Remove if possible, here only to satisfy Storybook.
    src?: string // Optional as `src` can be empty due to lazy loading strategy.
    sx?: SxProps
  }
  defaultComponent: D
}

export type MediaBaseProps<
  D extends React.ElementType = MediaBaseTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<MediaBaseTypeMap<P, D>, D>
