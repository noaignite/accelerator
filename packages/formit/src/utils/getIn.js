/* eslint-disable no-plusplus */

import toPath from 'lodash.topath'

// Based on: https://github.com/formium/formik/blob/559667c823331e8be85a50e8240e45f7c782fa3c/packages/formik/src/utils.ts
export default function getIn(obj, key, def, p = 0) {
  const path = toPath(key)
  while (obj && p < path.length) {
    obj = obj[path[p++]]
  }
  return obj === undefined ? def : obj
}
