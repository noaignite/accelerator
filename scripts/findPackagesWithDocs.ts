import fs from 'node:fs'
import path from 'node:path'

/** Returns packages that declare a documentation generator. */
export function findPackagesWithDocs(rootDir: string) {
  const packagesDir = path.join(rootDir, 'packages')
  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(packagesDir, name, 'package.json'), 'utf8'),
      ) as { scripts?: Record<string, string> }
      return Boolean(manifest.scripts?.['build:docs'])
    })
}
