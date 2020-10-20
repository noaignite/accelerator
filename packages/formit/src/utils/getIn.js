/* eslint-disable no-plusplus */

import toPath from 'lodash.topath'

// Based on `getIn` in: https://github.com/formium/formik/blob/master/packages/formik/src/utils.ts
export default function getIn(obj, key, def, p = 0) {
  const path = toPath(key)
  while (obj && p < path.length) {
    obj = obj[path[p++]]
  }
  return obj === undefined ? def : obj
}
