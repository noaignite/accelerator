import type { HintedString } from '@noaignite/types'
import type { RefObject } from 'react'
import { useIsomorphicEffect } from './useIsomorphicEffect'

/**
 * Quantity of currently active `useInert` hooks. Ensures that the `inert`
 * attribute is only removed when the last hook is unmounted.
 */
let instanceCount = 0

const INERT_INCLUDE = 'data-inert-include'
const INERT_EXCLUDE = 'data-inert-exclude'

/** A list of all tags in HTML & SVG specifications */
type TagNames = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap

/** Tagnames that should be skipped when applying the `inert` attribute */
const SKIPPED_ELEMENTS: HintedString<TagNames>[] = [
  'script',
  'style',
  'link',
  'meta',
  'head',
  'title',
  'noscript',
  'template',
  'slot',
]

/**
 * Removes the `inert` attribute from all elements in the DOM affected
 * by the `useInert()` hook.
 */
const resetInert = () => {
  const selector = `[${INERT_INCLUDE}]`

  const inertElements = document.querySelectorAll(selector)

  Array.from(inertElements).forEach((element) => {
    element.removeAttribute('inert')
    element.removeAttribute(INERT_INCLUDE)
  })
}

/**
 * Iterates over all children of the `scope` element and applies the `inert` attribute
 * to each child which does not contain the element to `ignore`.
 *
 * In the case where a child contains the `ignore` element, the function is called
 * recursively to apply the `inert` attribute to all descendants of the child which
 * does not contain the ignored element until the `ignore` element is reached.
 */
const applyInertToDescendants = (scope: Element, ignore: Element) => {
  Array.from(scope.children).forEach((child) => {
    if (child === ignore) return
    if (child.hasAttribute('inert')) return
    if (SKIPPED_ELEMENTS.includes(child.tagName.toLowerCase())) return

    if (child.contains(ignore)) {
      applyInertToDescendants(child, ignore)
      return
    }

    child.setAttribute('inert', '')
    child.setAttribute(INERT_INCLUDE, 'true')
  })
}

/**
 * Applies the `inert` attribute to all elements in the DOM except the branch which
 * contains the element to `ignore`.
 */
const applyInert = () => {
  const selector = `[${INERT_EXCLUDE}="${instanceCount}"]`

  const ignore = document.querySelector(selector)
  if (!ignore) return

  applyInertToDescendants(document.body, ignore)
}

/**
 * Applies `inert` to entire DOM-tree, excluding `ref` and its descendants.
 *
 * @param when - Whether to apply the `inert` attribute.
 * @param ref - The element to exclude from the `inert` attribute.
 *
 * @returns void
 *
 * @example
 * ```tsx
 * const [isDialogOpen, setIsDialogOpen] = useState(false)
 * const dialogRef = useRef<HTMLElement>(null)
 *
 * useInert(isDialogOpen, dialogRef)
 *
 * return (
 *   <Dialog ref={dialogRef} open={isDialogOpen} onClose={setIsDialogOpen} />
 * )
 * ```
 */
export const useInert = (when: boolean, ref: RefObject<Element | null>) => {
  const isElementDefined = Boolean(ref.current)

  useIsomorphicEffect(() => {
    if (!when) return

    const element = ref.current
    if (!(element instanceof Element)) return

    instanceCount += 1
    element.setAttribute(INERT_EXCLUDE, String(instanceCount))

    applyInert()

    return () => {
      if (instanceCount === 0) return

      instanceCount -= 1
      element.removeAttribute(INERT_EXCLUDE)

      resetInert()

      if (instanceCount > 0) applyInert()
    }
  }, [when, ref, isElementDefined])
}
