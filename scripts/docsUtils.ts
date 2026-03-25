import fs from 'node:fs'
import path from 'node:path'

/**
 * Ensures that a directory exists, creating it if it does not.
 */
export function ensureDirectoryExists(directory: string) {
  if (fs.existsSync(directory)) return
  fs.mkdirSync(directory, { recursive: true })
}

/**
 * Removes `directory` and recreates it empty.
 */
export function resetDirectory(directory: string) {
  fs.rmSync(directory, { recursive: true, force: true })
  ensureDirectoryExists(directory)
}

/**
 * Reads a file and returns its contents.
 */
export function readFromFile(source: string) {
  return fs.readFileSync(source, { encoding: 'utf-8' })
}

/**
 * Copy `source` to `destination`, creating its directory if needed, and log
 * the result.
 */
export function copyFileTo(source: string, destination: string) {
  ensureDirectoryExists(path.dirname(destination))
  fs.copyFileSync(source, destination)
  console.info(`Copied ${path.basename(source)} to: ${destination}`)
}

/**
 * Write `content` to `destination`, creating its directory if needed, and log
 * the result.
 */
export function writeFileTo(destination: string, content: string) {
  ensureDirectoryExists(path.dirname(destination))
  fs.writeFileSync(destination, content, { encoding: 'utf-8' })
  console.info(`Wrote file to: ${destination}`)
}

/**
 * Adds frontmatter to markdown content.
 */
export function injectFrontmatter(content: string, title: string, sidebarTitle?: string) {
  if (content.startsWith('---\n')) return content

  const frontmatter = [`title: ${JSON.stringify(title)}`]
  if (sidebarTitle) {
    frontmatter.push(`sidebarTitle: ${JSON.stringify(sidebarTitle)}`)
  }

  return `---\n${frontmatter.join('\n')}\n---\n\n${content}`
}
