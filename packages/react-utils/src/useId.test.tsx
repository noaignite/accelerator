import { render, renderHook } from '@testing-library/react'
import { createElement, useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { isReactElement, UseId } from '.'

describe('UseId', () => {
  it('is a function component', () => {
    expect(isReactElement(createElement(UseId))).toBe(true)
  })

  it('merges attributes correctly, applying them to underlying DOM element', async () => {
    const { findByTitle } = render(
      <UseId data-a="a-1">
        {() => (
          <UseId data-a="a-2" data-b="b-1">
            {() => <div title="Target" data-a="a-3" data-c="c-1" />}
          </UseId>
        )}
      </UseId>,
    )

    const target = await findByTitle('Target')
    expect(target.dataset['a']).toEqual('a-3')
    expect(target.dataset['b']).toEqual('b-1')
    expect(target.dataset['c']).toEqual('c-1')
  })

  it('forwards reference to underlying DOM element', async () => {
    const { result } = renderHook(() => useRef(null))

    const { findByTitle } = render(
      <UseId ref={result.current}>{() => <UseId>{() => <div title="Target" />}</UseId>}</UseId>,
    )

    const target = await findByTitle('Target')
    expect(result.current.current).toEqual(target)
  })

  it('disallows fragment child if reference if passed', async () => {
    const { result } = renderHook(() => useRef(null))

    let error: unknown

    try {
      render(
        <UseId ref={result.current}>
          {() => (
            <>
              <div title="Target" />
            </>
          )}
        </UseId>,
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
      render(<UseId>{() => <div ref={result.current} title="Target" />}</UseId>)
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
  })

  it('silently fails if child is falsy', () => {
    const condition = false as const

    const { queryByTitle } = render(<UseId>{() => condition && <div title="Target" />}</UseId>)

    expect(queryByTitle('Target')).toBeNull()
  })

  it('returns a unique string', async () => {
    const { findByTitle: findByTitle1 } = render(
      <UseId>{(id) => <div id={id} title="Target 1" />}</UseId>,
    )

    const { findByTitle: findByTitle2 } = render(
      <UseId>{(id) => <div id={id} title="Target 2" />}</UseId>,
    )

    const target1 = await findByTitle1('Target 1')
    const target2 = await findByTitle2('Target 2')

    expect(target1.id.length > 0).toBe(true)
    expect(target2.id.length > 0).toBe(true)
    expect(target1.id).not.toEqual(target2.id)
  })
})
