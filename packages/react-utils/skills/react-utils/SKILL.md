---
name: react-utils
description: >-
  Core routing skill for @noaignite/react-utils. Load this when working with
  shared React utility primitives, hooks, ref helpers, DOM observers,
  interaction hooks, responsive viewport helpers, or component factories from
  @noaignite/react-utils.
type: core
library: noaignite-react-utils
library_version: '0.16.1'
sources:
  - 'noaignite/accelerator:packages/react-utils/src/index.ts'
  - 'noaignite/accelerator:packages/react-utils/README.md'
  - 'noaignite/accelerator:packages/react-utils/dist/docs/*.md'
---

# React Utils

`@noaignite/react-utils` is a React-focused utility package for low-level UI
composition. It centers on reusable hooks and primitives for polymorphic
components, required context, error boundaries, refs, DOM events, observers,
dismissable layers, gestures, and responsive viewport state.

## Sub-Skills

| Task                                                                                                   | Sub-Skill                                                                                                                    |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Build polymorphic components, icons, required context, block renderers, or local error boundaries      | [react-utils/component-factories-and-block-rendering/SKILL.md](./component-factories-and-block-rendering/SKILL.md)           |
| Merge refs, forward inner refs, or read element refs across React versions                             | [react-utils/refs-and-element-wiring/SKILL.md](./refs-and-element-wiring/SKILL.md)                                           |
| Implement controlled or uncontrolled state, stable callbacks, SSR-safe effects, or timers              | [react-utils/controllable-state-stable-effects-and-timers/SKILL.md](./controllable-state-stable-effects-and-timers/SKILL.md) |
| Attach native listeners or observe resize, mutation, or intersection changes                           | [react-utils/native-events-and-observers/SKILL.md](./native-events-and-observers/SKILL.md)                                   |
| Build dialogs, popovers, and layered UI with outside click, Escape, inert background, and focus return | [react-utils/overlays-focus-and-dismissal/SKILL.md](./overlays-focus-and-dismissal/SKILL.md)                                 |
| Handle gestures, press-hold, drag-to-scroll, scroll progress, or sticky state                          | [react-utils/gestures-scroll-and-sticky-interactions/SKILL.md](./gestures-scroll-and-sticky-interactions/SKILL.md)           |
| Adapt to media queries, element or window size, visual viewport, or RTL directionality                 | [react-utils/responsive-viewport-and-directionality/SKILL.md](./responsive-viewport-and-directionality/SKILL.md)             |

## Quick Decision Tree

```
Need to build a reusable React primitive or typed component factory?
  -> react-utils/component-factories-and-block-rendering

Need to merge refs or expose an internal DOM node through a public ref?
  -> react-utils/refs-and-element-wiring

Need controlled/uncontrolled behavior, a stable callback, SSR-safe effect,
or a timeout/interval hook?
  -> react-utils/controllable-state-stable-effects-and-timers

Need a DOM event listener or an observer for resize, mutation, or visibility?
  -> react-utils/native-events-and-observers

Need dismissable overlays, focus return, or inert background behavior?
  -> react-utils/overlays-focus-and-dismissal

Need drag, press-hold, synthetic gesture events, scroll progress, or sticky state?
  -> react-utils/gestures-scroll-and-sticky-interactions

Need responsive or viewport-aware logic, or RTL-aware behavior?
  -> react-utils/responsive-viewport-and-directionality
```

## Minimal Working Example

```tsx
import type { ReactNode } from 'react'
import { createRequiredContext, useControlled } from '@noaignite/react-utils'

type AccordionContextValue = {
  open: boolean
  setOpen: (next: boolean) => void
}

const [useAccordionContext, AccordionProvider] =
  createRequiredContext<AccordionContextValue>('Accordion')

function Accordion(props: { open?: boolean; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useControlled({
    controlled: props.open,
    default: props.defaultOpen ?? false,
    name: 'Accordion',
    state: 'open',
  })

  return <AccordionProvider value={{ open, setOpen }}>{props.children}</AccordionProvider>
}

function AccordionTrigger() {
  const { open, setOpen } = useAccordionContext()
  return <button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</button>
}
```

## Common Mistakes

### HIGH: Picking a hook by name instead of by browser boundary

Many exports in this package are intentionally SSR-safe or DOM-specific. Pick
the sub-skill based on whether you are dealing with:

- component composition and typings
- refs and DOM node ownership
- browser event sources and observers
- overlay accessibility behavior
- viewport and responsive state

### HIGH: Assuming every hook returns browser state on first render

Hooks like `useMediaQuery`, `useRTL`, `useWindowSize`, and `useVisualViewport`
may return `undefined` or empty values during the initial render or on the
server. Write guard logic for that first render.

### MEDIUM: Replacing app-specific abstractions with lower-level helpers

These utilities are intentionally low-level. Use them to build application or
design-system primitives; do not treat them as a full component library.
