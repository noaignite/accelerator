/**
 * Transforms a given path to be root relative.
 *
 * @example
 * ```typescript
 * toRootRelativePath('foo/bar') // '/foo/bar'
 * toRootRelativePath('/foo/bar') // '/foo/bar'
 * toRootRelativePath('http://google.com/foo/bar') // 'http://google.com/foo/bar'
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL_API/Resolving_relative_references#root_relative
 */
export function toRootRelativePath(str: string) {
  // The string is parseable and therefore a valid absolute URL.
  // The string is therefore sufficient to be applied as a `href` attribute.
  // @see: https://developer.mozilla.org/en-US/docs/Web/API/URL/canParse_static
  if (URL.canParse(str)) {
    return str
  }

  // A string starting with a '/' is already root relative and thus needs no modification.
  // A string starting with a '?' or '#' is not part of the path and thus needs no modification.
  // @see: https://developer.mozilla.org/en-US/docs/Web/API/URL_API/Resolving_relative_references#current_directory_relative
  if (str[0] && '/#?'.includes(str[0])) {
    return str
  }

  // The passed base URL (`https://example.com`) doesn't matter here, since we don't use it in the returned value.
  const url = new URL(str, 'https://example.com')

  return `${url.pathname}${url.search}${url.hash}`
}
