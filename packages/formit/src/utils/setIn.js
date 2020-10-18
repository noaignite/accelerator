/* eslint-disable no-plusplus, no-multi-assign */

import clone from 'lodash.clone'
import toPath from 'lodash.topath'
import getIn from './getIn'
import isStringInteger from './isStringInteger'
import isObject from './isObject'

// Based on: https://github.com/formium/formik/blob/559667c823331e8be85a50e8240e45f7c782fa3c/packages/formik/src/utils.ts
export default function setIn(obj, path, value) {
  const res = clone(obj) // this keeps inheritance when obj is a class
  const pathArray = toPath(path)
  let resVal = res
  let i = 0

  for (; i < pathArray.length - 1; i++) {
    const currentPath = pathArray[i]
    const currentObj = getIn(obj, pathArray.slice(0, i + 1))

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj)
    } else {
      const nextPath = pathArray[i + 1]
      resVal = resVal[currentPath] = isStringInteger(nextPath) && Number(nextPath) >= 0 ? [] : {}
    }
  }

  // Return original object if new value is the same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj
  }

  if (value === undefined) {
    delete resVal[pathArray[i]]
  } else {
    resVal[pathArray[i]] = value
  }

  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]]
  }

  return res
}
