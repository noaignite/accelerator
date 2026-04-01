---
name: react-utils/component-factories-and-block-rendering
description: >-
  Build reusable primitives with createPolymorph, createRequiredContext,
  createSvgIcon, ErrorBoundary, and createRenderBlock. Load this when creating
  typed React building blocks, provider-backed APIs, icon components, local
  error isolation, or schema-driven block renderers.
type: sub-skill
library: noaignite-react-utils
library_version: '0.16.1'
requires:
  - react-utils
sources:
  - 'noaignite/accelerator:packages/react-utils/src/createPolymorph.ts'
  - 'noaignite/accelerator:packages/react-utils/src/createRenderBlock.tsx'
  - 'noaignite/accelerator:packages/react-utils/src/createRequiredContext.tsx'
  - 'noaignite/accelerator:packages/react-utils/src/createSvgIcon.tsx'
  - 'noaignite/accelerator:packages/react-utils/src/ErrorBoundary.ts'
---

This skill builds on `react-utils`. Read it first for package-level routing.

## Setup

```tsx
import type { ReactNode } from 'react'
import {
  createPolymorph,
  createRequiredContext,
  createSvgIcon,
  ErrorBoundary,
} from '@noaignite/react-utils'

const InfoIcon = createSvgIcon(
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />,
  'InfoIcon',
)

const [useBannerContext, BannerProvider] = createRequiredContext<{ tone: 'info' | 'danger' }>(
  'Banner',
)

const BannerRoot = createPolymorph<{ children: ReactNode }, 'div'>(
  ({ as: Tag = 'div', children, ...props }) => {
    const { tone } = useBannerContext()
    return (
      <Tag data-tone={tone} {...props}>
        {children}
      </Tag>
    )
  },
)

function Banner(props: { children: ReactNode }) {
  return (
    <BannerProvider value={{ tone: 'info' }}>
      <ErrorBoundary blockType="Banner" fallback={() => <div>Banner failed</div>}>
        <BannerRoot>{props.children}</BannerRoot>
      </ErrorBoundary>
    </BannerProvider>
  )
}
```

## Core Patterns

### Create polymorphic components without losing native props

`createPolymorph` combines your custom props with the native props of the
selected element and updates the allowed `ref` and attributes when `as` changes.

`createPolymorph` requires React 19+ at runtime. Although
`@noaignite/react-utils` supports React 18 more broadly, this helper asserts
React 19 or newer.

```tsx
import { createPolymorph } from '@noaignite/react-utils'

type ButtonProps = {
  variant: 'primary' | 'secondary'
}

export const Button = createPolymorph<ButtonProps, 'button'>(
  ({ as: Tag = 'button', variant, ...props }) => {
    return <Tag data-variant={variant} {...props} />
  },
)

<Button variant="primary" type="button">Save</Button>
<Button as="a" variant="secondary" href="/docs">Docs</Button>
```

### Create required context hooks that fail fast outside providers

`createRequiredContext` returns a hook whose value is always defined inside the
provider tree and throws if it is consumed outside the provider.

```tsx
import { createRequiredContext } from '@noaignite/react-utils'

type TabsContextValue = {
  activeId: string
  setActiveId: (id: string) => void
}

export const [useTabsContext, TabsProvider] = createRequiredContext<TabsContextValue>('Tabs')
```

### Wrap unstable subtrees in a local error boundary

`ErrorBoundary` catches rendering errors in its children and renders a fallback
component or function.

```tsx
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@noaignite/react-utils'

function WidgetFallback({ resetErrorBoundary }: ErrorBoundaryFallbackProps) {
  return <button onClick={resetErrorBoundary}>Retry widget</button>
}

;<ErrorBoundary blockType="RemoteWidget" fallback={WidgetFallback}>
  <RemoteWidget />
</ErrorBoundary>
```

### Render heterogeneous CMS-style blocks with adapters

`createRenderBlock` maps `blockType` values to components, then optionally runs
adapters, applies default props, and exposes shared globals to adapters.

`renderBlock` expects both block data and either a numeric render index or a
context object.

```tsx
import { createRenderBlock } from '@noaignite/react-utils'

const renderBlock = createRenderBlock(
  {
    Hero: ({ title, eyebrow }: { title: string; eyebrow?: string }) => (
      <section>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </section>
    ),
  },
  {
    defaultProps: {
      Hero: { eyebrow: 'Featured' },
    },
    adapters: {
      Hero: async (props: { title: string }, _context, globals: { suffix: string }) => ({
        ...props,
        title: `${props.title}${globals.suffix}`,
      }),
    },
    globals: { suffix: '!' },
  },
)

const block = await renderBlock({ blockType: 'Hero', props: { title: 'Hello' } }, 0)
```

## Common Mistakes

### HIGH: Re-implementing polymorphism with manual unions

```tsx
// WRONG
import type { ComponentProps } from 'react'

type Props = ComponentProps<'button'> & ComponentProps<'a'>

// CORRECT
const Button = createPolymorph<{ variant: 'primary' | 'secondary' }, 'button'>(
  ({ as: Tag = 'button', variant, ...props }) => <Tag data-variant={variant} {...props} />,
)
```

Manual unions lose the main benefit of `createPolymorph`: the `as` prop changes
the valid native props and ref type.

### HIGH: Using required context hooks outside the provider tree

`createRequiredContext` is designed to fail loudly. If a consumer can render
outside the provider, fix the component structure instead of weakening the hook.

### HIGH: Using `createPolymorph` in React 18 projects

`createPolymorph` asserts React 19+ at runtime. In React 18 codebases, do not
use this helper unless the runtime and typings have already been upgraded.

### MEDIUM: Treating `createRenderBlock` adapters as render functions

Adapters are for transforming block data before render. Keep UI rendering in the
registered block component and use adapters only for enrichment or shaping.
