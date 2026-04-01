---
name: react-utils/overlays-focus-and-dismissal
description: >-
  Use useDismiss, useFocusReturn, and useInert to build dialogs, popovers, and
  layered interfaces that dismiss on outside interaction or Escape, restore
  focus on close, and make background content inert while the layer is open.
type: sub-skill
library: noaignite-react-utils
library_version: '0.16.1'
requires:
  - react-utils
sources:
  - 'noaignite/accelerator:packages/react-utils/src/useDismiss.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useFocusReturn.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useInert.ts'
---

This skill builds on `react-utils`. Read it first for package-level routing.

## Setup

```tsx
import { useRef, useState } from 'react'
import { useDismiss, useFocusReturn, useInert } from '@noaignite/react-utils'

function Dialog() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useFocusReturn(open)
  useInert(open, ref)
  useDismiss(ref, () => setOpen(false), { when: open })

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      {open ? <div ref={ref}>Dialog content</div> : null}
    </>
  )
}
```

## Core Patterns

### Close a layer on outside press or Escape

`useDismiss` handles two common dismissal channels: outside `pointerdown` and
`Escape` keydown.

```tsx
import { useRef, useState } from 'react'
import { useDismiss } from '@noaignite/react-utils'

function Popover() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useDismiss(ref, () => setOpen(false), { when: open })

  return open ? <div ref={ref}>Popover</div> : <button onClick={() => setOpen(true)}>Open</button>
}
```

### Return focus to the previously focused element when the layer closes

Use `useFocusReturn` with the same open state that controls the overlay.

```tsx
import { useFocusReturn } from '@noaignite/react-utils'

function Sheet({ open }: { open: boolean }) {
  useFocusReturn(open)
  return open ? <div role="dialog">Sheet</div> : null
}
```

### Make background content inert while the overlay is active

`useInert` applies `inert` across the DOM tree except for the referenced layer
and its descendants.

```tsx
import { useRef } from 'react'
import { useInert } from '@noaignite/react-utils'

function Modal({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useInert(open, ref)

  return open ? <div ref={ref}>Modal</div> : null
}
```

## Common Mistakes

### HIGH: Wiring dismissal without focus restoration

If a dialog or popover steals focus on open, pair dismissal with
`useFocusReturn(open)` so keyboard users land back on the triggering control.

### HIGH: Leaving background content interactive while the overlay is open

If the overlay is modal, use `useInert(open, ref)` so clicks and focus do not
fall through to the rest of the page.

### MEDIUM: Running dismissal logic when the layer is closed

Pass `{ when: open }` to `useDismiss` so listeners are active only while the
layer is mounted or intended to be interactive.
