/* eslint import/namespace: ['error', { allowComputed: true }] */
/**
 * Important: This test also serves as a point to
 * import the entire lib for coverage reporting
 */

import * as OUI from './index'

describe('oui', () => {
  it('should have exports', () => {
    expect(typeof OUI).toEqual('object')
  })

  it('should not do undefined exports', () => {
    Object.keys(OUI).forEach((exportKey) => expect(Boolean(OUI[exportKey])).toEqual(true))
  })
})
