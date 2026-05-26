export type PathKey = string | number

export type Path = ReadonlyArray<PathKey> | string

function toPathKey(segment: string): PathKey {
  return /^\d+$/.test(segment) ? Number(segment) : segment
}

function normalizePath(path: Path): PathKey[] {
  if (Array.isArray(path)) {
    return [...path]
  }

  if (typeof path !== 'string') {
    return []
  }

  if (path === '') {
    return []
  }

  return path.split('.').map(toPathKey)
}

/**
 * Reads a deeply nested value by path.
 *
 * @param object - Source object.
 * @param path - Dot-separated string path or array path.
 * @param defaultValue - Value returned when the path does not exist.
 */
export function getIn<TDefault = undefined>(object: unknown, path: Path, defaultValue?: TDefault) {
  const normalizedPath = normalizePath(path)
  let current: unknown = object

  if (normalizedPath.length === 0) {
    return current
  }

  for (const key of normalizedPath) {
    if (
      current === null ||
      typeof current !== 'object' ||
      !Object.prototype.hasOwnProperty.call(current, key)
    ) {
      return defaultValue
    }

    current = current[key as keyof typeof current]
  }

  return current
}
