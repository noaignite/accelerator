import { appendFile, readdir, readFile, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

type Compatibility = {
  node: string
  platform: string
  architecture: string
  imageOS: string
  imageVersion: string
  year: number
  schema: number
}

export function compatibilityKey(environment: Compatibility) {
  const { node, platform, architecture, imageOS, imageVersion, year, schema } = environment
  for (const value of [node, platform, architecture, imageOS, imageVersion]) {
    if (!/^[\w.-]+$/.test(value)) throw new Error('Missing or invalid cache compatibility metadata')
  }
  return `turbo-v${schema}-${platform}-${architecture}-${imageOS}-${imageVersion}-node${node.replace(/^v/, '')}-${year}-`
}

type Summary = { tasks: { hash: string }[] }

/** The directory is exclusively owned by CI; never point it at the shared worktree cache. */
export async function pruneSnapshot(directory: string, summaries: Summary[], maxBytes: number) {
  const hashes = new Set(summaries.flatMap(({ tasks }) => tasks.map(({ hash }) => hash)))
  if (!hashes.size || [...hashes].some((hash) => !/^[a-f0-9]{16}$/.test(hash))) {
    throw new Error('Missing or invalid Turbo task summaries; refusing to save a snapshot')
  }
  let bytes = 0
  let archives = 0
  for (const entry of await readdir(directory)) {
    const match = /^([a-f0-9]{16})(?:\.tar\.zst|-meta\.json)$/.exec(entry)
    const filename = path.join(directory, entry)
    if (!match || !hashes.has(match[1]!)) {
      await rm(filename, { recursive: true, force: true })
    } else {
      bytes += (await stat(filename)).size
      if (entry.endsWith('.tar.zst')) archives++
    }
  }
  return { bytes, archives, save: archives > 0 && bytes <= maxBytes }
}

async function output(name: string, value: string) {
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`)
  console.log(`${name}=${value}`)
}

async function main() {
  switch (process.argv[2]) {
    case 'key':
      await output(
        'prefix',
        compatibilityKey({
          node: process.version,
          platform: process.platform,
          architecture: process.arch,
          imageOS: process.env.ImageOS ?? '',
          imageVersion: process.env.ImageVersion ?? '',
          year: new Date().getUTCFullYear(),
          schema: 1,
        }),
      )
      break
    case 'prune': {
      const runs = path.resolve('.turbo/runs')
      const summaries = await Promise.all(
        (await readdir(runs))
          .filter((entry) => entry.endsWith('.json'))
          .map(
            async (entry) => JSON.parse(await readFile(path.join(runs, entry), 'utf8')) as Summary,
          ),
      )
      const result = await pruneSnapshot(
        path.resolve('.turbo/ci-cache'),
        summaries,
        256 * 1024 * 1024,
      )
      await output('save', String(result.save))
      const message = `Turbo snapshot: ${result.archives} archives, ${result.bytes} bytes after pruning; save=${result.save} (256 MiB ceiling).\n`
      console.log(message)
      if (process.env.GITHUB_STEP_SUMMARY) {
        await appendFile(process.env.GITHUB_STEP_SUMMARY, message)
      }
      break
    }
    default:
      throw new Error('Expected key or prune')
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
