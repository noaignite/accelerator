import fs from 'node:fs'
import path from 'node:path'

/**
 * Config
 */
const rootDir = path.resolve(process.cwd(), '..')
const packagesDir = path.join(rootDir, 'packages')
const outputDir = path.join(process.cwd(), 'src/content')
const copyDocsFilePaths = ['./CONTRIBUTING.md', './README.md', './docs/CHANGELOG.md']
const renameFileNames: Record<string, string> = {
  'README.md': 'index.md',
}

/**
 * Returns whether `source` matches a root-relative file path.
 */
function isRootFile(source: string, filePathFromRoot: string) {
  return path.resolve(source) === path.resolve(rootDir, filePathFromRoot)
}

/**
 * Ensures that a directory exists, creating it if it does not.
 */
function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

/**
 * Removes `directory` and recreates it empty.
 */
function resetDirectory(directory: string) {
  fs.rmSync(directory, { recursive: true, force: true })
  ensureDirectoryExists(directory)
}

/**
 * Copy `source` to `destination`, creating its directory if needed, and log
 * the result.
 */
function copyFileTo(source: string, destination: string) {
  ensureDirectoryExists(path.dirname(destination))
  fs.copyFileSync(source, destination)
  console.info(`Copied ${path.basename(source)} to: ${destination}`)
}

/**
 * Write `content` to `destination`, creating its directory if needed, and log
 * the result.
 */
function writeToFile(destination: string, content: string) {
  ensureDirectoryExists(path.dirname(destination))
  fs.writeFileSync(destination, content, { encoding: 'utf-8' })
  console.info(`Wrote file to: ${destination}`)
}

/**
 * Reads a file and returns its contents. Additionally injects docs frontmatter
 * when needed.
 */
function readFromFile(source: string) {
  const content = fs.readFileSync(source, { encoding: 'utf-8' })

  if (isRootFile(source, 'README.md') && !content.startsWith('---\n')) {
    return `---\ntitle: Getting Started\n---\n\n${content}`
  }

  return content
}

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
    resetDirectory(destinationDir)

    const copyRecursive = (directory: string, relativePath = '') => {
      const entries = fs.readdirSync(directory, { withFileTypes: true })

      entries.forEach((entry) => {
        const sourcePath = path.join(directory, entry.name)
        const nextRelativePath = path.join(relativePath, entry.name)

        if (entry.isDirectory()) {
          copyRecursive(sourcePath, nextRelativePath)
          return
        }

        if (!entry.isFile()) return

        const originalName = path.basename(entry.name)
        const finalName =
          originalName === 'index.md' ? originalName : renameGeneratedMarkdown(originalName)
        const destinationPath = path.join(destinationDir, path.dirname(nextRelativePath), finalName)

        copyFileTo(sourcePath, destinationPath)
      })
    }

    copyRecursive(sourceDir)

    const changelogPath = path.join(packagesDir, packageName, 'CHANGELOG.md')
    if (fs.existsSync(changelogPath)) {
      copyFileTo(changelogPath, path.join(destinationDir, 'CHANGELOG.md'))
    }
  })
}

/**
 * Renames generated markdown files to their published docs filenames.
 */
function renameGeneratedMarkdown(fileName: string) {
  const ext = path.extname(fileName)
  if (ext !== '.md') return fileName

  const baseName = path.basename(fileName, ext)
  if (baseName.endsWith('.generated')) return fileName

  return `${baseName}.generated${ext}`
}

/**
 * Copies the repo-level docs files into the docs site content tree.
 */
function copyRootDocs() {
  copyDocsFilePaths.forEach((relativePath) => {
    const source = path.join(rootDir, relativePath)
    if (!fs.existsSync(source)) return

    const originalName = path.basename(source)
    const finalName = renameFileNames[originalName] ?? originalName
    const destination = path.join(outputDir, finalName)

    if (originalName === 'README.md') {
      writeToFile(destination, readFromFile(source))
      return
    }

    copyFileTo(source, destination)
  })
}

/**
 * Rebuilds the docs site content from package-local docs and root docs.
 */
function generateDocs() {
  resetDirectory(outputDir)
  copyPackageDocs()
  copyRootDocs()
}

generateDocs()
