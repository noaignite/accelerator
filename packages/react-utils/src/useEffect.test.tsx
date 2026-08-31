import { render, renderHook } from '@testing-library/react'
import { createElement, useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { isReactElement, UseEffect } from '.'

describe('UseEffect', () => {
  it('is a function component', () => {
    expect(isReactElement(createElement(UseEffect))).toBe(true)
  })

  it('merges attributes correctly, applying them to underlying DOM element', async () => {
    const { findByTitle } = render(
      <UseEffect effect={() => {}} deps={[]} data-a="a-1">
        <UseEffect effect={() => {}} deps={[]} data-a="a-2" data-b="b-1">
          <div title="Target" data-a="a-3" data-c="c-1" />
        </UseEffect>
      </UseEffect>,
    )

    const target = await findByTitle('Target')
    expect(target.dataset['a']).toEqual('a-3')
    expect(target.dataset['b']).toEqual('b-1')
    expect(target.dataset['c']).toEqual('c-1')
  })

  it('forwards reference to underlying DOM element', async () => {
    const { result } = renderHook(() => useRef(null))

    const { findByTitle } = render(
      <UseEffect ref={result.current} effect={() => {}} deps={[]}>
        <UseEffect effect={() => {}} deps={[]}>
          <div title="Target" />
        </UseEffect>
      </UseEffect>,
    )

    const target = await findByTitle('Target')
    expect(result.current.current).toEqual(target)
  })

  it('disallows fragment child if reference if passed', async () => {
    const { result } = renderHook(() => useRef(null))

    let error: unknown

    try {
      render(
        <UseEffect ref={result.current} effect={() => {}} deps={[]}>
          <>
            <div title="Target" />
          </>
        </UseEffect>,
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
        <UseEffect effect={() => {}} deps={[]}>
          <div ref={result.current} title="Target" />
        </UseEffect>,
      )
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
  })

  it('silently fails if child is falsy', () => {
    const condition = false as const

    const { queryByTitle } = render(
      <UseEffect effect={() => {}} deps={[]}>
        {/* eslint-disable-next-line react/jsx-no-leaked-render -- Deliberate*/}
        {condition && <div title="Target" />}
      </UseEffect>,
    )

    expect(queryByTitle('Target')).toBeNull()
  })

  it('calls the effect function when mounted and cleanup when unmounted', () => {
    const cleanup = vi.fn()
    const effect = vi.fn().mockImplementation(() => cleanup)

    const { unmount } = render(
      <UseEffect effect={effect}>
        <div />
      </UseEffect>,
    )

    expect(effect).toHaveBeenCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()

    unmount()

    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('re-runs effect when deps change', () => {
    const effect = vi.fn().mockImplementation(() => vi.fn())

    const { rerender } = render(
      <UseEffect effect={effect} deps={[0]}>
        <div />
      </UseEffect>,
    )

    expect(effect).toHaveBeenCalledTimes(1)

    rerender(
      <UseEffect effect={effect} deps={[0]}>
        <div />
      </UseEffect>,
    )
    expect(effect).toHaveBeenCalledTimes(1)

    rerender(
      <UseEffect effect={effect} deps={[1]}>
        <div />
      </UseEffect>,
    )
    expect(effect).toHaveBeenCalledTimes(2)
  })
})
