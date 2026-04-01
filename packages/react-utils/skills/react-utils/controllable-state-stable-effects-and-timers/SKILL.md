---
name: react-utils/controllable-state-stable-effects-and-timers
description: >-
  Use useControlled, useStableCallback, useIsomorphicEffect, useInterval, and
  useTimeout for controlled state ownership, fresh callbacks with stable
  identity, SSR-safe effect timing, and timer-driven UI behavior.
type: sub-skill
library: noaignite-react-utils
library_version: '0.16.1'
requires:
  - react-utils
sources:
  - 'noaignite/accelerator:packages/react-utils/src/useControlled.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useStableCallback.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useIsomorphicEffect.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useInterval.ts'
  - 'noaignite/accelerator:packages/react-utils/src/useTimeout.ts'
---

This skill builds on `react-utils`. Read it first for package-level routing.

## Setup

```tsx
import { useState } from 'react'
import {
  useControlled,
  useIsomorphicEffect,
  useStableCallback,
  useTimeout,
} from '@noaignite/react-utils'

function Toast(props: { open?: boolean; defaultOpen?: boolean }) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useControlled({
    controlled: props.open,
    default: props.defaultOpen ?? false,
    name: 'Toast',
    state: 'open',
  })

  const close = useStableCallback(() => setOpen(false))

  useIsomorphicEffect(() => {
    setMounted(true)
  }, [])

  useTimeout(
    () => {
      close()
    },
    4000,
    { when: open },
  )

  if (!mounted || !open) return null
  return <div role="status">Saved</div>
}
```

## Core Patterns

### Build components that support controlled and uncontrolled usage

`useControlled` returns the current value and a setter. In controlled mode, the
setter is a no-op, so pair it with an explicit external change callback if the
component needs to notify its parent.

```tsx
import { useControlled } from '@noaignite/react-utils'

function Disclosure(props: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (next: boolean) => void
}) {
  const [open, setOpen] = useControlled({
    controlled: props.open,
    default: props.defaultOpen ?? false,
    name: 'Disclosure',
    state: 'open',
  })

  const update = (next: boolean) => {
    setOpen(next)
    props.onOpenChange?.(next)
  }

  return <button onClick={() => update(!open)}>{open ? 'Collapse' : 'Expand'}</button>
}
```

### Use stable callbacks inside timers and subscriptions

`useStableCallback` gives you a stable function reference that still reads the
latest props and state.

```tsx
import { useInterval, useStableCallback } from '@noaignite/react-utils'

function Poller({ enabled, onTick }: { enabled: boolean; onTick: () => void }) {
  const tick = useStableCallback(onTick)
  useInterval(
    () => {
      tick()
    },
    1000,
    { when: enabled },
  )

  return null
}
```

### Use `useIsomorphicEffect` when layout timing matters in SSR-capable apps

`useIsomorphicEffect` runs `useLayoutEffect` in the browser and falls back to
`useEffect` on the server to avoid server-render warnings.

```tsx
import { useRef } from 'react'
import { useIsomorphicEffect } from '@noaignite/react-utils'

function AutoMeasure() {
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  return <div ref={ref}>Measured</div>
}
```

## Common Mistakes

### HIGH: Switching between controlled and uncontrolled modes accidentally

```tsx
// WRONG
const [open, setOpen] = useControlled({
  controlled: maybeUndefinedLater,
  default: false,
  name: 'Dialog',
})
```

Keep ownership stable for the component lifetime. If a parent controls a value,
always pass it.

### HIGH: Using raw closures inside `useInterval` or `useTimeout`

Timer callbacks often capture stale state. `useTimeout` and `useInterval`
already wrap the callback with `useStableCallback`, so prefer the `when` option
to enable or disable timers instead of passing sentinel delay values.

### MEDIUM: Using `useLayoutEffect` directly in shared SSR-capable primitives

Prefer `useIsomorphicEffect` in reusable components that may render on the
server and still need layout-effect timing in the browser.
