import fs from 'node:fs'
import path from 'node:path'
import * as pagefind from 'pagefind'

/**
 * Config
 */
const serverDir = path.join(process.cwd(), '.next/server')
const outputPath = path.join(process.cwd(), 'public/_pagefind')

/**
 * Returns the directories containing prerendered HTML.
 *
 * Without a build adapter, Next.js writes prerendered pages to `server/app`.
 * When an adapter is active (e.g. on Vercel), they are written to
 * `server/route-cache/<kind>/<hash>/$/` instead, mirroring the same layout.
 *
 * @returns The existing directories to index.
 */
function findSiteDirectories() {
  const directories = [path.join(serverDir, 'app')]
  const routeCacheDir = path.join(serverDir, 'route-cache')

  if (fs.existsSync(routeCacheDir)) {
    for (const kind of fs.readdirSync(routeCacheDir)) {
      for (const hash of fs.readdirSync(path.join(routeCacheDir, kind))) {
        directories.push(path.join(routeCacheDir, kind, hash, '$'))
      }
    }
  }

  return directories.filter((directory) => fs.existsSync(directory))
}

/**
 * Builds the Pagefind search index from the prerendered Next.js output.
 */
async function main() {
  const { index, errors } = await pagefind.createIndex()

  if (!index) {
    throw new Error(`Failed to create Pagefind index: ${errors.join(', ')}`)
  }

  let pageCount = 0

  for (const directory of findSiteDirectories()) {
    const response = await index.addDirectory({ path: directory })

    if (response.errors.length > 0) {
      throw new Error(`Failed to index ${directory}: ${response.errors.join(', ')}`)
    }

    pageCount += response.page_count
  }

  if (pageCount === 0) {
    throw new Error(`Pagefind found no HTML pages to index in ${serverDir}`)
  }

  await index.writeFiles({ outputPath })
  await pagefind.close()

  console.info(`Pagefind processed ${pageCount} HTML files into ${outputPath}`)
}

await main()
