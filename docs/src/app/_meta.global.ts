import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.join(process.cwd(), 'src/content')

const packages = fs
  .readdirSync(contentDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right))

const packagesWithExports = packages.filter((packageName) => {
  const packageDir = path.join(contentDir, packageName)

  return fs
    .readdirSync(packageDir, { withFileTypes: true })
    .some((entry) => entry.isFile() && entry.name.endsWith('.generated.md'))
})

export default {
  contact: {
    type: 'page',
    title: 'Contact us',
    href: 'https://www.noaignite.se/contact',
  },
  index: 'Getting Started',
  CONTRIBUTING: 'Contributing',
  CHANGELOG: 'Changelog',
  '-': {
    type: 'separator',
    title: 'Packages',
  },
  ...packages.reduce(
    (acc, title) => ({
      ...acc,
      [title]: {
        title,
        items: {
          index: 'Getting Started',
          CHANGELOG: 'Changelog',
          ...(packagesWithExports.includes(title) && {
            '-': {
              type: 'separator',
              title: 'Exports',
            },
          }),
        },
      },
    }),
    {},
  ),
}
