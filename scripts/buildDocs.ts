import fs from 'node:fs'
import path from 'node:path'
import { injectFrontmatter, readFromFile, resetDirectory, writeFileTo } from './docsUtils.ts'

/**
 * Config
 */
const rootDir = path.resolve(process.cwd(), '..')
const packagesDir = path.join(rootDir, 'packages')
const outputDir = path.join(process.cwd(), 'src/content')
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
    source: './docs/CHANGELOG.md',
    destination: 'Changelog.md',
    title: 'Changelog',
  },
]

/**
 * Returns all direct subdirectories within `directory`.
 */
function findDirectories(directory: string) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

/**
 * Copies each package's local docs folder into the docs site content tree.
 */
function copyPackageDocs() {
  const packages = findDirectories(packagesDir)

  packages.forEach((packageName) => {
    const sourceDir = path.join(packagesDir, packageName, 'dist/docs')
    if (!fs.existsSync(sourceDir)) return

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
function buildDocs() {
  resetDirectory(outputDir)
  copyPackageDocs()
  copyRootDocs()
}

buildDocs()
