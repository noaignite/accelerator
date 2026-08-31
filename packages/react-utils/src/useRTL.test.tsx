import { act, render, renderHook } from '@testing-library/react'
import { createElement, useRef } from 'react'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { isReactElement, UseRTL } from '.'
import { useRTL } from './useRTL'

class MutationObserverStub {
  private callback: MutationCallback
  private static targets = new WeakMap<Node, MutationCallback>()

  constructor(callback: MutationCallback) {
    this.callback = callback
  }

  observe(target: Node, options: MutationObserverInit) {
    if (options.attributes) {
      MutationObserverStub.targets.set(target, this.callback)
    }
  }

  disconnect() {
    if (!(this instanceof Node)) return
    MutationObserverStub.targets.delete(this)
  }

  static triggerAttributeChange(target: Node, attributeName: string) {
    const callback = MutationObserverStub.targets.get(target)

    if (callback) {
      const mutationRecord: MutationRecord = {
        type: 'attributes',
        target,
        attributeName,
        attributeNamespace: null,
        oldValue: null,
        addedNodes: NodeList.prototype,
        nextSibling: null,
        previousSibling: null,
        removedNodes: NodeList.prototype,
      }
      callback(
        [mutationRecord],
        new MutationObserver(() => {
          void 0
        }),
      )
    }
  }
}

beforeAll(() => {
  vi.stubGlobal('MutationObserver', MutationObserverStub)
})

afterEach(() => {
  document.documentElement.removeAttribute('dir')
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('useRTL', () => {
  function Scenario1() {
    const isRTL = useRTL()
    return <div data-is-rtl={isRTL} title="Target" />
  }

  it('defaults to LTR when no `dir` attribute is set on `HTMLHtmlElement`', async () => {
    const { findByTitle } = render(<Scenario1 />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('false')
  })

  it('respects `dir` attribute of `HTMLHtmlElement`', async () => {
    document.documentElement.dir = 'rtl'

    const { findByTitle } = render(<Scenario1 />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('true')
  })

  it('changes to `dir` attribute on `HTMLHtmlElement` updates return value', async () => {
    const { findByTitle } = render(<Scenario1 />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('false')

    act(() => {
      document.documentElement.dir = 'rtl'
      MutationObserverStub.triggerAttributeChange(document.documentElement, 'dir')
    })

    expect(target.getAttribute('data-is-rtl')).toBe('true')

    act(() => {
      document.documentElement.dir = 'ltr'
      MutationObserverStub.triggerAttributeChange(document.documentElement, 'dir')
    })

    expect(target.getAttribute('data-is-rtl')).toBe('false')
  })

  function Scenario2({
    containerDir,
    targetDir,
    when = true,
  }: {
    containerDir?: 'ltr' | 'rtl'
    targetDir?: 'ltr' | 'rtl'
    when?: boolean
  }) {
    const ref = useRef<HTMLDivElement>(null)
    const isRTL = useRTL({ ref, when })

    return (
      <div dir={containerDir}>
        <div data-is-rtl={isRTL} dir={targetDir} ref={ref} title="Target" />
      </div>
    )
  }

  it('defaults to closest `Element` with a `dir` attribute if referenced element does not have `dir` attribute', async () => {
    const { findByTitle } = render(<Scenario2 containerDir="rtl" />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('true')
  })

  it('defaults to referenced element if referenced element has `dir` attribute', async () => {
    const { findByTitle } = render(<Scenario2 containerDir="rtl" targetDir="ltr" />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('false')
  })

  it('changes to `dir` attribute on referenced element updates return value', async () => {
    const { findByTitle } = render(<Scenario2 targetDir="ltr" />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('false')

    act(() => {
      target.dir = 'rtl'
      MutationObserverStub.triggerAttributeChange(target, 'dir')
    })

    expect(target.getAttribute('data-is-rtl')).toBe('true')

    act(() => {
      target.dir = 'ltr'
      MutationObserverStub.triggerAttributeChange(target, 'dir')
    })

    expect(target.getAttribute('data-is-rtl')).toBe('false')
  })

  it('when disabled, retains return value and does not observe for changes', async () => {
    const { findByTitle } = render(<Scenario2 targetDir="rtl" when={false} />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('true')

    act(() => {
      target.dir = 'ltr'
      MutationObserverStub.triggerAttributeChange(target, 'dir')
    })

    expect(target.getAttribute('data-is-rtl')).toBe('true')
  })

  it('when unmounted, retains return value and does not observe for changes', async () => {
    const { findByTitle, unmount } = render(<Scenario2 targetDir="ltr" />)

    const target = await findByTitle('Target')
    expect(target.getAttribute('data-is-rtl')).toBe('false')

    unmount()

    act(() => {
      target.dir = 'ltr'
      MutationObserverStub.triggerAttributeChange(target, 'dir')
    })

    expect(target.getAttribute('data-is-rtl')).toBe('false')
  })
})

describe('UseRTL', () => {
  it('is a function component', () => {
    expect(isReactElement(createElement(UseRTL))).toBe(true)
  })

  it('merges attributes correctly, applying them to underlying DOM element', async () => {
    const { findByTitle } = render(
      <UseRTL data-a="a-1">
        {() => (
          <UseRTL data-a="a-2" data-b="b-1">
            {() => <div title="Target" data-a="a-3" data-c="c-1" />}
          </UseRTL>
        )}
      </UseRTL>,
    )

    const target = await findByTitle('Target')
    expect(target.dataset['a']).toEqual('a-3')
    expect(target.dataset['b']).toEqual('b-1')
    expect(target.dataset['c']).toEqual('c-1')
  })

  it('forwards reference to underlying DOM element', async () => {
    const { result } = renderHook(() => useRef(null))

    const { findByTitle } = render(
      <UseRTL ref={result.current}>{() => <UseRTL>{() => <div title="Target" />}</UseRTL>}</UseRTL>,
    )

    const target = await findByTitle('Target')
    expect(result.current.current).toEqual(target)
  })

  it('disallows fragment child if reference if passed', async () => {
    const { result } = renderHook(() => useRef(null))

    let error: unknown

    try {
      render(
        <UseRTL ref={result.current}>
          {() => (
            <>
              <div title="Target" />
            </>
          )}
        </UseRTL>,
      )
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
  })

  it('disallows child to have reference assigned', async () => {
    const { result } = renderHook(() => useRef(null))

    let error: unknown

    try {
      render(<UseRTL>{() => <div ref={result.current} title="Target" />}</UseRTL>)
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
  })

  it('silently fails if child is falsy', () => {
    const condition = false as const

    const { queryByTitle } = render(<UseRTL>{() => condition && <div title="Target" />}</UseRTL>)

    expect(queryByTitle('Target')).toBeNull()
  })

  it('returns and tracks document directionality', async () => {
    const { findByTitle } = render(
      <UseRTL>{(isRTL) => <div title="Target" data-is-rtl={isRTL ? '' : undefined} />}</UseRTL>,
    )

    const target = await findByTitle('Target')

    expect(target.hasAttribute('data-is-rtl')).toBe(false)
    expect(target.hasAttribute('data-rtl')).toBe(false)

    act(() => {
      document.documentElement.dir = 'rtl'
      MutationObserverStub.triggerAttributeChange(document.documentElement, 'dir')
    })

    expect(target.hasAttribute('data-is-rtl')).toBe(true)
    expect(target.hasAttribute('data-rtl')).toBe(true)
  })

  it('returns and tracks local directionality', async () => {
    const { findByTitle } = render(
      <div title="Container" dir="rtl">
        <UseRTL scoped>
          {(isRTL) => <div title="Target" data-is-rtl={isRTL ? '' : undefined} />}
        </UseRTL>
      </div>,
    )

    const container = await findByTitle('Container')
    const target = await findByTitle('Target')

    expect(document.documentElement.dir).toEqual('')
    expect(container.dir).toEqual('rtl')
    expect(target.hasAttribute('data-is-rtl')).toBe(true)

    act(() => {
      container.dir = 'ltr'
      MutationObserverStub.triggerAttributeChange(container, 'dir')
    })

    expect(document.documentElement.dir).toEqual('')
    expect(container.dir).toEqual('ltr')
    expect(target.hasAttribute('data-is-rtl')).toBe(false)
  })
})
