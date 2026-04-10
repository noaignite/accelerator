---
name: react-utils/native-events-and-observers
description: >-
  Use useEvent, useIntersectionObserver, useResizeObserver, and
  useMutationObserver to connect React components to browser event sources and
  DOM observation APIs while keeping listener and observer setup declarative.
type: sub-skill
library: noaignite-react-utils
library_version: '0.16.1'
requires:
  - react-utils
sources:
  - 'noaignite/accelerator:packages/react-utils/src/useEvent.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useIntersectionObserver.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useResizeObserver.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useMutationObserver.ts'
---

This skill builds on `react-utils`. Read it first for package-level routing.

## Setup

```tsx
import { useRef, useState } from 'react'
import { useEvent, useIntersectionObserver, useResizeObserver } from '@noaignite/react-utils'

function ResponsiveImage() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)

  useEvent(
    'window',
    'resize',
    () => {
      setWidth(window.innerWidth)
    },
    { passive: true },
  )

  useIntersectionObserver(
    ref,
    (entry) => {
      setVisible(entry.isIntersecting)
    },
    { once: true },
  )

  useResizeObserver(ref, (entry) => {
    setWidth(entry.contentRect.width)
  })

  return <div ref={ref}>{visible ? `Visible at ${width}px` : 'Waiting'}</div>
}
```

## Core Patterns

### Attach native listeners to global targets or elements

`useEvent` accepts a target plus event type and listener. For server-safe code,
global targets can be referenced by string names like `'window'`.

```tsx
import { useEvent } from '@noaignite/react-utils'

function EscapeHandler({ onEscape }: { onEscape: () => void }) {
  useEvent('document', 'keydown', (event) => {
    if (event.key === 'Escape') onEscape()
  })

  return null
}
```

### Observe when an element becomes visible

`useIntersectionObserver` is a good fit for lazy media, analytics beacons, and
progressive hydration triggers.

```tsx
import { useRef, useState } from 'react'
import { useIntersectionObserver } from '@noaignite/react-utils'

function LazySection() {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useIntersectionObserver(
    ref,
    (entry) => {
      if (entry.isIntersecting) setReady(true)
    },
    { once: true },
  )

  return <section ref={ref}>{ready ? <HeavyContent /> : null}</section>
}
```

### Observe geometry or DOM structure changes

Use `useResizeObserver` for element box changes and `useMutationObserver` for
attribute or child-list changes.

```tsx
import { useRef, useState } from 'react'
import { useMutationObserver, useResizeObserver } from '@noaignite/react-utils'

function ObservedPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(0)

  useMutationObserver(
    ref,
    (record) => {
      setLoading(record.attributeName === 'data-loading')
    },
    { attributes: true, attributeFilter: ['data-loading'] },
  )

  useResizeObserver(ref, (entry) => {
    setHeight(entry.contentRect.height)
  })

  return <div ref={ref}>{loading ? `Loading at ${height}px` : `Ready at ${height}px`}</div>
}
```

## Common Mistakes

### HIGH: Reading browser globals directly during render when `useEvent` already supports safe target names

```tsx
// BETTER
useEvent('window', 'resize', onResize)
```

Using string target names helps the hook stay compatible with server rendering.

### MEDIUM: Using resize observation to approximate intersection behavior

Use the matching observer for the job:

- visibility or viewport entry -> `useIntersectionObserver`
- element box changes -> `useResizeObserver`
- DOM attribute or child mutations -> `useMutationObserver`

### MEDIUM: Forgetting observer options that bound updates

Use options like `once`, `attributeFilter`, or a custom root when the observer
should stop early or track only a narrow change surface.
