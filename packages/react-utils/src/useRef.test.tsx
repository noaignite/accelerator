import { render, renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { createElement, useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { isReactElement, UseRef } from '.'

describe('UseRef', () => {
  it('is a function component', () => {
    expect(isReactElement(createElement(UseRef))).toBe(true)
  })

  it('merges attributes correctly, applying them to underlying DOM element', async () => {
    const { findByTitle } = render(
      <UseRef initialValue={null} data-a="a-1">
        {() => (
          <UseRef initialValue={null} data-a="a-2" data-b="b-1">
            {() => <div title="Target" data-a="a-3" data-c="c-1" />}
          </UseRef>
        )}
      </UseRef>,
    )

    const target = await findByTitle('Target')
    expect(target.dataset['a']).toEqual('a-3')
    expect(target.dataset['b']).toEqual('b-1')
    expect(target.dataset['c']).toEqual('c-1')
  })

  it('forwards reference to underlying DOM element', async () => {
    const { result } = renderHook(() => useRef(null))

    const { findByTitle } = render(
      <UseRef ref={result.current} initialValue={null}>
        {() => <UseRef initialValue={null}>{() => <div title="Target" />}</UseRef>}
      </UseRef>,
    )

    const target = await findByTitle('Target')
    expect(result.current.current).toEqual(target)
  })

  it('disallows fragment child if reference if passed', async () => {
    const { result } = renderHook(() => useRef(null))

    let error: unknown

    try {
      render(
        <UseRef ref={result.current} initialValue={null}>
          {() => (
            <>
              <div title="Target" />
            </>
          )}
        </UseRef>,
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
      render(
        <UseRef initialValue={null}>{() => <div ref={result.current} title="Target" />}</UseRef>,
      )
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
  })

  it('silently fails if child is falsy', () => {
    const condition = false as const

    const { queryByTitle } = render(
      <UseRef initialValue={null}>{() => condition && <div title="Target" />}</UseRef>,
    )

    expect(queryByTitle('Target')).toBeNull()
  })

  it('provides a ref with an initial value', () => {
    let capturedRef: RefObject<number> | undefined

    render(
      <UseRef initialValue={42}>
        {(ref) => {
          capturedRef = ref
          return <div />
        }}
      </UseRef>,
    )

    expect(capturedRef?.current).toBe(42)
  })

  it('maintains ref identity across rerenders', () => {
    const refs: unknown[] = []

    const { rerender } = render(
      <UseRef initialValue={{ a: 1, b: 2 }}>
        {(ref) => {
          refs.push(ref)
          return <div />
        }}
      </UseRef>,
    )

    rerender(
      <UseRef initialValue={{ a: 1, b: 2 }}>
        {(ref) => {
          refs.push(ref)
          return <div />
        }}
      </UseRef>,
    )

    expect(refs[0]).toBe(refs[1])
  })
})
