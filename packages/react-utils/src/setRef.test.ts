import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { setRef } from './setRef'

describe('setRef', () => {
  it('can handle callback refs', () => {
    const ref = vi.fn()
    const instance = 'proxy'

    setRef(ref, instance)

    expect(ref).toHaveBeenCalled() // vitest matcher
    expect(ref).toHaveBeenCalledWith(instance) // vitest matcher for args
  })

  it('can handle ref objects', () => {
    const ref = createRef()
    const instance = 'proxy'

    setRef(ref, instance)

    expect(ref.current).toBe(instance)
  })

  it('ignores falsy refs without errors', () => {
    const instance = 'proxy'

    // all no-ops
    expect(() => setRef(undefined, instance)).not.toThrow()
    expect(() => setRef(null, instance)).not.toThrow()
  })

  it('throws on legacy string refs', () => {
    expect(() => {
      // @ts-expect-error -- Test incorrect interface.
      setRef('stringRef1', 'proxy')
    }).toThrow()
  })
})
