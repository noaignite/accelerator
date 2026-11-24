import fs from 'node:fs'
import path from 'node:path'
import { injectFrontmatter, readFromFile, resetDirectory, writeFileTo } from './docsUtils.ts'
import { findPackagesWithDocs } from './findPackagesWithDocs.ts'

/**
 * Config
 */
const rootDir = path.resolve(import.meta.dirname, '..')
const packagesDir = path.join(rootDir, 'packages')
const outputDir = path.join(process.cwd(), 'src/content')
const packages = findPackagesWithDocs(rootDir)
const rootDocs = [
  {
    source: './README.md',
    destination: 'index.md',
    title: 'Getting Started',
  },
  {
    source: './CONTRIBUTING.md',
    destination: 'Contributing.md',
    title: 'Contributing',
  },
  {
    source: './apps/docs/CHANGELOG.md',
    destination: 'Changelog.md',
    title: 'Changelog',
  },
]

/**
 * Copies each package's local docs folder into the docs site content tree.
 */
function copyPackageDocs() {
  packages.forEach((packageName) => {
    const sourceDir = path.join(packagesDir, packageName, 'dist/docs')

    const destinationDir = path.join(outputDir, packageName)
    fs.cpSync(sourceDir, destinationDir, { recursive: true })
    console.info(`Copied docs from: ${sourceDir} to: ${destinationDir}`)
  })
}

/**
 * Copies the repo-level docs files into the docs site content tree.
 */
function copyRootDocs() {
  rootDocs.forEach((entry) => {
    const { source: relativePath, destination, title } = entry

    const source = path.join(rootDir, relativePath)
    if (!fs.existsSync(source)) return

    let content = readFromFile(source)
    content = injectFrontmatter(content, title)
    writeFileTo(path.join(outputDir, destination), content)
  })
}

/**
 * Rebuilds the docs site content from package-local docs and root docs.
 */
function assembleDocsContent() {
  const missing = packages
    .map((name) => path.join(packagesDir, name, 'dist/docs/index.md'))
    .filter((file) => !fs.existsSync(file))
  if (missing.length > 0) {
    throw new Error(
      `Missing package documentation:\n${missing.join('\n')}\nRun pnpm packages:build-docs from the repository root, or use pnpm build.`,
    )
  }
  resetDirectory(outputDir)
  copyPackageDocs()
  copyRootDocs()
}

assembleDocsContent()
