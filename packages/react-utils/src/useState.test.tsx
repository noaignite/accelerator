import { render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement, useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { isReactElement, UseState } from '.'

describe('UseState', () => {
  it('is a function component', () => {
    expect(isReactElement(createElement(UseState))).toBe(true)
  })

  it('merges attributes correctly, applying them to underlying DOM element', async () => {
    const { findByTitle } = render(
      <UseState initialState={0} data-a="a-1">
        {() => (
          <UseState initialState={0} data-a="a-2" data-b="b-1">
            {() => <div title="Target" data-a="a-3" data-c="c-1" />}
          </UseState>
        )}
      </UseState>,
    )

    const target = await findByTitle('Target')
    expect(target.dataset['a']).toEqual('a-3')
    expect(target.dataset['b']).toEqual('b-1')
    expect(target.dataset['c']).toEqual('c-1')
  })

  it('forwards reference to underlying DOM element', async () => {
    const { result } = renderHook(() => useRef(null))

    const { findByTitle } = render(
      <UseState ref={result.current} initialState={0}>
        {() => <UseState initialState={0}>{() => <div title="Target" />}</UseState>}
      </UseState>,
    )

    const target = await findByTitle('Target')
    expect(result.current.current).toEqual(target)
  })

  it('disallows fragment child if reference if passed', async () => {
    const { result } = renderHook(() => useRef(null))

    let error: unknown

    try {
      render(
        <UseState ref={result.current} initialState={0}>
          {() => (
            <>
              <div title="Target" />
            </>
          )}
        </UseState>,
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
        <UseState initialState={0}>{() => <div ref={result.current} title="Target" />}</UseState>,
      )
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
  })

  it('silently fails if child is falsy', () => {
    const condition = false as const

    const { queryByTitle } = render(
      <UseState initialState={0}>{() => condition && <div title="Target" />}</UseState>,
    )

    expect(queryByTitle('Target')).toBeNull()
  })

  it('renders with initial state', async () => {
    const { findByTitle } = render(
      <UseState initialState={42}>{([state]) => <div title="target">{state}</div>}</UseState>,
    )

    const target = await findByTitle('target')
    expect(target.textContent).toEqual('42')
  })

  it('updates state when setState is called', async () => {
    const { findByTitle } = render(
      <UseState initialState={0}>
        {([state, setState]) => (
          <>
            <button
              title="button"
              onClick={() => setState((prev) => prev + 1)}
              data-state={state}
            />
          </>
        )}
      </UseState>,
    )

    const button = await findByTitle('button')

    expect(button.dataset['state']).toEqual('0')
    await userEvent.click(button)
    expect(button.dataset['state']).toEqual('1')
  })
})
