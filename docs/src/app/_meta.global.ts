import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.join(process.cwd(), 'src/content')

function getPackageNames() {
  return fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function buildPackageMeta(packageName: string) {
  const fileCount = fs
    .readdirSync(path.join(contentDir, packageName), { withFileTypes: true })
    .filter((entry) => entry.isFile()).length

  return [
    packageName,
    {
      title: packageName,
      items: fileCount > 1 ? { '-': { type: 'separator', title: 'Exports' } } : {},
    },
  ] as const
}

const packageMeta = Object.fromEntries(getPackageNames().map(buildPackageMeta))

export default {
  contact: {
    type: 'page',
    title: 'Contact us',
    href: 'https://www.noaignite.se/contact',
  },
  index: 'Getting Started',
  Contributing: 'Contributing',
  Changelog: 'Changelog',
  '-': {
    type: 'separator',
    title: 'Packages',
  },
  ...packageMeta,
}
