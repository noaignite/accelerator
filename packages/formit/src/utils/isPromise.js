import isFunction from './isFunction'
import isObject from './isObject'

export default function isPromise(value) {
  return isObject(value) && isFunction(value.then)
}
