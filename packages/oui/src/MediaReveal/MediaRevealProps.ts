import * as React from 'react'
import { OverrideProps } from '@mui/types'
import { SxProps } from '@mui/system'
import { TransitionProps } from '@mui/material/transitions'

export interface MediaRevealTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    children:
      | React.ReactElement
      | ((props: { inView: boolean; loaded: boolean; reveal: boolean }) => React.ReactNode)
    onEnter?: (entry: IntersectionObserverEntry) => void
    onLoaded?: (instance: unknown) => void
    rootMargin?: string
    sx?: SxProps
    TransitionComponent?: React.JSXElementConstructor<
      TransitionProps & { children?: React.ReactElement }
    >
    transitionDuration?: number
    TransitionProps?: TransitionProps
  }
  defaultComponent: D
}

export type MediaRevealProps<
  D extends React.ElementType = MediaRevealTypeMap['defaultComponent'],
  P = { component?: D },
> = OverrideProps<MediaRevealTypeMap<P, D>, D>
