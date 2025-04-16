import { exec } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'

// Use the current working directory
const baseDir = process.cwd()
// Add any folder or file names you want to remove
const targetPaths = ['.turbo', '.next', 'coverage', 'dist', 'node_modules']

// Convert exec to return a Promise
const execPromise = promisify(exec)

// Function to find specified directories and files
function findPaths(dir: string, targetPaths: string[]) {
  let results: string[] = []
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)

    if (statSync(filePath).isDirectory()) {
      if (targetPaths.includes(file)) {
        results.push(filePath) // Add directory to results
      } else {
        results = results.concat(findPaths(filePath, targetPaths)) // Recursively search
      }
    } else if (targetPaths.includes(file)) {
      results.push(filePath) // Add matching file
    }
  }
  return results
}

// Function to delete directories and files
async function deletePaths(paths: string[]) {
  const deletePromises = paths.map(async (path) => {
    try {
      await execPromise(`rm -rf "${path}"`)
      console.info(`Deleted: ${path}`)
    } catch (err) {
      console.error(`Error deleting ${path}:`, err)
    }
  })

  await Promise.all(deletePromises) // Wait for all deletions to complete
}

// Main script
async function cleanPaths(baseDir: string, targetPaths: string[]) {
  console.info(`Searching for the following paths in ${baseDir}: ${targetPaths.join(', ')}`)
  const paths = findPaths(baseDir, targetPaths)

  if (paths.length === 0) {
    console.info('No matching paths found.')
  } else {
    console.info(`Found ${paths.length} paths to delete.`)
    await deletePaths(paths)
  }
}

cleanPaths(baseDir, targetPaths)
