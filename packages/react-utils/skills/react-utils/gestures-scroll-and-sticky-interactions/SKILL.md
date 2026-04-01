---
name: react-utils/gestures-scroll-and-sticky-interactions
description: >-
  Use useGesture, usePressHold, useDragScroll, useScrollProgress, and
  useSticky for pointer-driven interactions, drag-to-scroll containers,
  long-press behavior, viewport-relative scroll progress, and sticky-state UI.
type: sub-skill
library: noaignite-react-utils
library_version: '0.16.1'
requires:
  - react-utils
sources:
  - 'noaignite/accelerator:packages/react-utils/src/useGesture.ts'
  - 'noaignite/accelerator:packages/react-utils/src/usePressHold.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useDragScroll.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useScrollProgress.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useSticky.ts'
---

This skill builds on `react-utils`. Read it first for package-level routing.

## Setup

```tsx
import { useRef, useState } from 'react'
import { useDragScroll, usePressHold, useScrollProgress, useSticky } from '@noaignite/react-utils'

function ScrollRail() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const isSticky = useSticky(ref)

  useDragScroll(ref)
  usePressHold(
    ref,
    () => {
      console.log('Held')
    },
    { duration: 600 },
  )
  useScrollProgress(ref, (entry) => {
    setProgress(entry.innerProgress)
  })

  return (
    <div ref={ref} data-sticky={isSticky}>
      {Math.round(progress * 100)}%
    </div>
  )
}
```

## Core Patterns

### Build custom pointer interactions with `useGesture`

`useGesture` emits synthetic start, move, and end events and can be constrained
by axis, pointer type, dead zone, and lifespan.

```tsx
import { useRef } from 'react'
import { useGesture } from '@noaignite/react-utils'

function SwipeTarget() {
  const ref = useRef<HTMLDivElement>(null)

  useGesture(ref, {
    axis: 'x',
    onGestureMove: ({ deltaX }) => {
      console.log('Dragged horizontally by', deltaX)
    },
  })

  return <div ref={ref}>Swipe me</div>
}
```

### Turn a scroll container into a drag-scroll surface

`useDragScroll` builds on `useGesture`, limits input to mouse dragging, and can
add inertia after the drag ends.

```tsx
import { useRef } from 'react'
import { useDragScroll } from '@noaignite/react-utils'

function CarouselTrack() {
  const ref = useRef<HTMLDivElement>(null)
  useDragScroll(ref, { inertia: true })

  return <div ref={ref} style={{ overflow: 'auto', whiteSpace: 'nowrap' }} />
}
```

### Use long-press, scroll progress, and sticky state for richer feedback

These hooks fit when UI state depends on duration, viewport progress, or CSS
sticky behavior.

```tsx
import { useRef, useState } from 'react'
import { usePressHold, useScrollProgress, useSticky } from '@noaignite/react-utils'

function StickyProgressHeader() {
  const ref = useRef<HTMLDivElement>(null)
  const [outerProgress, setOuterProgress] = useState(0)
  const stuck = useSticky(ref)

  usePressHold(ref, () => console.log('Pinned action'), { duration: 1000 })
  useScrollProgress(ref, (entry) => {
    setOuterProgress(entry.outerProgress)
  })

  return (
    <div ref={ref} data-stuck={stuck}>
      {Math.round(outerProgress * 100)}%
    </div>
  )
}
```

## Common Mistakes

### HIGH: Using `useGesture` without constraining invalid movement when the interaction is directional

If the UI expects only horizontal or vertical input, set `axis` and tune
`deadZone` so tiny accidental pointer movement does not trigger gesture logic.

### MEDIUM: Re-implementing drag-scroll instead of using `useDragScroll`

`useDragScroll` already wires gesture movement into scroll position and handles
optional inertial movement. Prefer it over bespoke mousemove bookkeeping.

### MEDIUM: Expecting `useSticky` to make an element sticky

`useSticky` only reports whether an element is currently stuck. The element still
needs CSS like `position: sticky` and an offset such as `top`.
