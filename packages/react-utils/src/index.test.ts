import * as ReactUtils from '@noaignite/react-utils'
import { describe, expect, it } from 'vitest'
import { exports as packageExports } from '../package.json'

describe('@noaignite/react-utils', () => {
  it('exposes every public module export identically at the root', async () => {
    const subpaths = Object.keys(packageExports).filter(
      (subpath) => !['.', './package.json'].includes(subpath),
    )

    expect(subpaths.length).toBeGreaterThan(0)

    await Promise.all(
      subpaths.map(async (subpath) => {
        const specifier = `@noaignite/react-utils/${subpath.slice(2)}`
        const module = await import(specifier)

        for (const [name, value] of Object.entries(module)) {
          const rootValue = (ReactUtils as Record<string, unknown>)[name]
          expect(rootValue, `${subpath}: ${name}`).not.toBeUndefined()
          expect(value, `${subpath}: ${name}`).toBe(rootValue)
        }
      }),
    )
  })
})
