import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { MLCallback } from '@maeertin/medialoaded'

export interface MediaLoaderTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    children?: React.ReactNode | ((props: { loaded: boolean }) => React.ReactNode)
    onLoaded?: MLCallback
  }
  defaultComponent: D
}

export type MediaLoaderProps<
  D extends React.ElementType = MediaLoaderTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<MediaLoaderTypeMap<P, D>, D>
