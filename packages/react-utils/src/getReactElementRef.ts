import { isObject } from '@noaignite/utils'
import { isValidElement, version, type ReactElement, type Ref } from 'react'

/**
 * Returns the ref of a React element handling differences between React 19 and
 * older versions. It will throw runtime error if the element is not a valid
 * React element.
 *
 * @param element - ReactElement
 * @returns Ref<any> | null
 */
export function getReactElementRef(element: ReactElement): Ref<unknown> | null {
  if (isValidElement(element)) {
    // 'ref' is passed as prop in React 19, whereas 'ref' is directly attached to
    // children in older versions
    if (parseInt(version, 10) >= 19 && isObject(element.props) && 'ref' in element.props) {
      return element.props.ref as Ref<unknown>
    }
    if ('ref' in element) {
      return element.ref as Ref<unknown>
    }
  }
  return null
}
