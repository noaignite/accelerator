---
name: react-utils/responsive-viewport-and-directionality
description: >-
  Use useElementSize, useWindowSize, useVisualViewport, useMediaQuery, and
  useRTL to drive responsive logic from element geometry, browser viewport
  state, zoom-aware visual viewport metrics, media queries, and directionality.
type: sub-skill
library: noaignite-react-utils
library_version: '0.16.1'
requires:
  - react-utils
sources:
  - 'noaignite/accelerator:packages/react-utils/src/useElementSize.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useWindowSize.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useVisualViewport.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useMediaQuery.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useRTL.ts'
---

This skill builds on `react-utils`. Read it first for package-level routing.

## Setup

```tsx
import { useRef } from 'react'
import {
  useElementSize,
  useMediaQuery,
  useRTL,
  useVisualViewport,
  useWindowSize,
} from '@noaignite/react-utils'

function ResponsivePanel() {
  const ref = useRef<HTMLDivElement>(null)
  const { clientWidth } = useElementSize(ref)
  const { innerWidth } = useWindowSize()
  const { width: visualWidth, scale } = useVisualViewport()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isRTL = useRTL({ ref })

  return (
    <div ref={ref} dir="rtl">
      {String({ clientWidth, innerWidth, visualWidth, scale, isMobile, isRTL })}
    </div>
  )
}
```

## Core Patterns

### Measure an element instead of the whole window when the layout is container-driven

`useElementSize` tracks a specific ref and is a better fit than `useWindowSize`
when component layout depends on the rendered element itself.

```tsx
import { useRef } from 'react'
import { useElementSize } from '@noaignite/react-utils'

function MasonryCell() {
  const ref = useRef<HTMLDivElement>(null)
  const { clientWidth, clientHeight } = useElementSize(ref)

  return (
    <div ref={ref}>
      {clientWidth} x {clientHeight}
    </div>
  )
}
```

### Branch responsive UI from a media query or viewport size

Use `useMediaQuery` for declarative breakpoint checks and `useWindowSize` when
you need raw viewport numbers.

```tsx
import { useMediaQuery, useWindowSize } from '@noaignite/react-utils'

function LayoutSwitcher() {
  const isCompact = useMediaQuery('(max-width: 768px)')
  const { innerWidth } = useWindowSize()

  if (isCompact === undefined || innerWidth === undefined) return null
  return isCompact ? <MobileNav /> : <DesktopNav width={innerWidth} />
}
```

### Use visual viewport and RTL when device behavior depends on zoom or direction

`useVisualViewport` is useful for mobile browser chrome and zoom-sensitive UI.
`useRTL` reports whether the document or a local subtree is right-to-left.

```tsx
import { useRef } from 'react'
import { useRTL, useVisualViewport } from '@noaignite/react-utils'

function FloatingToolbar() {
  const ref = useRef<HTMLDivElement>(null)
  const { height, scale } = useVisualViewport()
  const isRTL = useRTL({ ref })

  return (
    <div ref={ref} data-rtl={isRTL}>
      {height}:{scale}
    </div>
  )
}
```

## Common Mistakes

### HIGH: Assuming these hooks always return concrete browser values on first render

```tsx
// WRONG
const isMobile = useMediaQuery('(max-width: 640px)')
return isMobile ? <Mobile /> : <Desktop />

// CORRECT
const isMobile = useMediaQuery('(max-width: 640px)')
if (isMobile === undefined) return null
return isMobile ? <Mobile /> : <Desktop />
```

Guard the initial render, especially in SSR-capable code.

### MEDIUM: Using window size when the component really depends on container size

Prefer `useElementSize` when a component is embedded in resizable sidebars,
panels, grids, or iframes.

### MEDIUM: Treating `useRTL()` as document-only

`useRTL` can observe local directionality via `{ ref }`. Use that when a nested
subtree overrides `dir`.
