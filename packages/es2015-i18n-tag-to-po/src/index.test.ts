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
          },
          "components/Link/Link.js": {
            "Quantity": "Amount",
            "Color": "Color",
            "Size": "Height"
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

      #: src/components/Link/Link.js
      msgid \\"Quantity\\"
      msgstr \\"Amount\\"

      #: src/components/Link/Link.js
      msgid \\"Color\\"
      msgstr \\"Color\\"

      #: src/components/Link/Link.js
      msgid \\"Size\\"
      msgstr \\"Height\\"
      "
    `)
  })
})
