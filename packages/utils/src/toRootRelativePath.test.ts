import { expect, test } from 'vitest'
import { toRootRelativePath } from './toRootRelativePath'

test.each([
  ['foo/bar', '/foo/bar'],
  ['/foo/bar', '/foo/bar'],
  ['https://google.com/foo', 'https://google.com/foo'],
  ['foo/bar?baz=true', '/foo/bar?baz=true'],
  ['foo/bar#baz', '/foo/bar#baz'],
  ['foo/bar?baz=true#hello', '/foo/bar?baz=true#hello'],
  ['?foo=bar', '?foo=bar'],
  ['?foo=bar#baz', '?foo=bar#baz'],
])('toRootRelativePath(%s) -> %s', (input, expected) => {
  expect(toRootRelativePath(input)).toBe(expected)
})
