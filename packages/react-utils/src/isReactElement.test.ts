import { createElement, Fragment } from 'react'
import { describe, expect, it, test } from 'vitest'
import { isReactElement } from '.'

describe('isReactElement', () => {
  it('is a function', () => {
    expect(isReactElement).toBeTypeOf('function')
  })

  const Component = () => createElement('div')

  test.each([
    [createElement('div'), true],
    [createElement(Component), true],
    [createElement(() => 1), true],
    [createElement(Fragment), true],
    [Fragment, false],
    [[], false],
    [null, false],
    [{}, false],
    [undefined, false],
  ])('isReactElement(%s) is %s', (input, expected) => {
    expect(isReactElement(input)).toEqual(expected)
  })
})
