import * as React from 'react'
import { OverrideProps } from '@mui/types'

export type ScrollEntry = {
  innerProgress: number
  progress: number
  target: HTMLDivElement
}

export interface ScrollProgressTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    friction?: number
    onChange?: (entry: ScrollEntry) => void
    onEnter?: (entry: IntersectionObserverEntry) => void
    onExit?: (entry: IntersectionObserverEntry) => void
    precision?: number
  }
  defaultComponent: D
}

export type ScrollProgressProps<
  D extends React.ElementType = ScrollProgressTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<ScrollProgressTypeMap<P, D>, D>
