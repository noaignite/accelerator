import { type Path, type PathKey } from './getIn'

function toPathKey(segment: string): PathKey {
  return /^\d+$/.test(segment) ? Number(segment) : segment
}

function normalizePath(path: Path): PathKey[] {
  if (Array.isArray(path)) {
    return [...path]
  }

  if (typeof path !== 'string' || path === '') {
    return []
  }

  return path.split('.').map(toPathKey)
}

function isObjectLike(value: unknown): value is Record<PropertyKey, unknown> {
  return value !== null && typeof value === 'object'
}

function cloneShallow(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [...value]
  }

  if (isObjectLike(value)) {
    return { ...value }
  }

  return value
}

function createContainerForKey(key: PathKey): unknown {
  return typeof key === 'number' ? [] : {}
}

/**
 * Returns a new object/array with a deeply nested value written at `path`.
 */
export function setIn<T>(object: T, path: Path, value: unknown): T {
  const normalizedPath = normalizePath(path)

  if (normalizedPath.length === 0) {
    return value as T
  }

  const firstKey = normalizedPath[0]!
  const sourceRoot = isObjectLike(object) ? object : createContainerForKey(firstKey)
  const targetRoot = cloneShallow(sourceRoot) as Record<PropertyKey, unknown>

  let sourceCursor: unknown = sourceRoot
  let targetCursor: Record<PropertyKey, unknown> = targetRoot

  normalizedPath.forEach((key, index) => {
    const isLast = index === normalizedPath.length - 1

    if (isLast) {
      targetCursor[key] = value
      return
    }

    const nextKey = normalizedPath[index + 1]!
    const sourceNext = isObjectLike(sourceCursor) ? sourceCursor[key] : undefined

    const nextValue = isObjectLike(sourceNext)
      ? cloneShallow(sourceNext)
      : createContainerForKey(nextKey)

    targetCursor[key] = nextValue
    sourceCursor = sourceNext
    targetCursor = nextValue as Record<PropertyKey, unknown>
  })

  return targetRoot as T
}
