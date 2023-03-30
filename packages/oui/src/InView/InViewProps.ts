import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { SxProps } from '@mui/system'

export interface InViewTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    additionalProps?: Record<string, unknown>
    children?: React.ReactNode | ((props: { inView: boolean }) => React.ReactNode)
    onEnter?: (entry: IntersectionObserverEntry) => void
    onExit?: (entry: IntersectionObserverEntry) => void
    root?: HTMLElement
    rootMargin?: string
    sx?: SxProps
    threshold?: number | number[]
    triggerOnce?: boolean
  }
  defaultComponent: D
}

export type InViewProps<
  D extends React.ElementType = InViewTypeMap['defaultComponent'],
  P = { component?: React.ElementType },
> = OverrideProps<InViewTypeMap<P, D>, D>
