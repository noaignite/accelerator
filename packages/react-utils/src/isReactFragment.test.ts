import { createElement, Fragment } from 'react'
import { describe, expect, it, test } from 'vitest'
import { isReactFragment } from '.'

describe('isReactFragment', () => {
  it('is a function', () => {
    expect(isReactFragment).toBeTypeOf('function')
  })

  const Component = () => createElement('div')

  test.each([
    [Fragment, true],
    [createElement(Fragment), true],
    [createElement('div'), false],
    [createElement(Component), false],
    [createElement(() => 1), false],
    [[], false],
    [null, false],
    [{}, false],
    [undefined, false],
  ])('isReactFragment(%s) is %s', (input, expected) => {
    expect(isReactFragment(input)).toEqual(expected)
  })
})
