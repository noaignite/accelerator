/* eslint import/namespace: ['error', { allowComputed: true }] */
/**
 * Important: This test also serves as a point to
 * import the entire lib for coverage reporting
 */

import * as OakwoodUI from './index'

describe('material-ui', () => {
  it('should have exports', () => {
    expect(typeof OakwoodUI).toEqual('object')
  })

  it('should not do undefined exports', () => {
    Object.keys(OakwoodUI).forEach((exportKey) =>
      expect(Boolean(OakwoodUI[exportKey])).toEqual(true),
    )
  })
})
