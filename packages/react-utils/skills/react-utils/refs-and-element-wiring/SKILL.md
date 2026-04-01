---
name: react-utils/refs-and-element-wiring
description: >-
  Merge refs with useForkRef, expose inner DOM nodes with setRef, and read refs
  from React elements with getReactElementRef. Load this when building wrapper
  components, accepting refs through component props, or handling React 19 ref
  differences safely.
type: sub-skill
library: noaignite-react-utils
library_version: '0.16.1'
requires:
  - react-utils
sources:
  - 'noaignite/accelerator:packages/react-utils/src/useForkRef.ts'
  - 'noaignite/accelerator:packages/react-utils/src/setRef.ts'
  - 'noaignite/accelerator:packages/react-utils/src/getReactElementRef.ts'
---

This skill builds on `react-utils`. Read it first for package-level routing.

## Setup

```tsx
import type { ComponentProps, Ref, ReactNode } from 'react'
import { Children, cloneElement, isValidElement, useRef } from 'react'
import { setRef, useForkRef } from '@noaignite/react-utils'

function Input({ ref, ...props }: ComponentProps<'input'>) {
  const localRef = useRef<HTMLInputElement>(null)
  const mergedRef = useForkRef(localRef, ref)

  return <input ref={mergedRef} {...props} />
}

function focusProgrammatically(ref: Ref<HTMLInputElement>, node: HTMLInputElement | null) {
  setRef(ref, node)
}
```

## Core Patterns

### Merge local and forwarded refs in one stable ref callback

Use `useForkRef` when the component needs a local DOM ref and also exposes that
same node to consumers through the `ref` prop.

```tsx
import type { ComponentProps } from 'react'
import { useRef } from 'react'
import { useForkRef } from '@noaignite/react-utils'

function TextField({ ref, ...props }: ComponentProps<'input'>) {
  const localRef = useRef<HTMLInputElement>(null)
  const mergedRef = useForkRef(localRef, ref)

  return <input ref={mergedRef} {...props} />
}
```

### Expose an internal node with `setRef`

`setRef` writes a node into either an object ref or a callback ref and safely
no-ops on falsy refs.

```tsx
import type { Ref } from 'react'
import { setRef } from '@noaignite/react-utils'

function assignNode<T>(ref: Ref<T>, node: T | null) {
  setRef(ref, node)
}
```

### Read the ref attached to a React element across React versions

`getReactElementRef` abstracts over the ref placement differences between React
19 and older versions.

```tsx
import type { ReactNode } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import { getReactElementRef } from '@noaignite/react-utils'

function Slot({ children }: { children: ReactNode }) {
  const child = Children.only(children)
  if (!isValidElement(child)) return null

  const childRef = getReactElementRef(child)
  return cloneElement(child, { ref: childRef })
}
```

## Common Mistakes

### HIGH: Overwriting a consumer ref with a local ref

```tsx
// WRONG
function Input(props: ComponentProps<'input'>) {
  const localRef = useRef<HTMLInputElement>(null)

  return <input ref={localRef} {...props} />
}

// CORRECT
function Input({ ref, ...props }: ComponentProps<'input'>) {
  const localRef = useRef<HTMLInputElement>(null)
  const mergedRef = useForkRef(localRef, ref)

  return <input ref={mergedRef} {...props} />
}
```

If the component accepts a `ref` prop, preserve both ownership paths.

### MEDIUM: Manually branching on callback refs versus object refs

`setRef` already handles both ref shapes. Use it instead of repeating fragile
`typeof ref === 'function'` logic in every wrapper component.

### MEDIUM: Calling `getReactElementRef` on arbitrary values

`getReactElementRef` expects a valid React element and returns `null` for
invalid or ref-less input. Validate or narrow children before calling it.
