import { describe, it, expect } from '@jest/globals'
import { dedent } from 'ts-dedent'
import toPo from './toPo'

describe('es2015-i18n-tag-to-lingui-po', () => {
  it('should return a origin comment', () => {
    expect(
      toPo(dedent`
        {
          "containers/CartItem/CartItem.js": {
            "Quantity": "",
            "Remove": "Delete",
            "Size": ""
          }
        }`),
    ).toMatchInlineSnapshot(`
      "#: src/containers/CartItem/CartItem.js
      msgid \\"Quantity\\"
      msgstr \\"Quantity\\"

      #: src/containers/CartItem/CartItem.js
      msgid \\"Remove\\"
      msgstr \\"Delete\\"

      #: src/containers/CartItem/CartItem.js
      msgid \\"Size\\"
      msgstr \\"Size\\"
      "
    `)
  })
})
