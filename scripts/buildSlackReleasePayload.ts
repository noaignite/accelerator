import { appendFileSync } from 'node:fs'
import { EOL } from 'node:os'
import { pathToFileURL } from 'node:url'

type PublishedPackage = {
  name: string
  version: string
}

type SlackPayload = {
  text: string
  blocks: {
    type: 'section'
    text: {
      type: 'mrkdwn'
      text: string
    }
  }[]
}

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

function parsePublishedPackages(input: string | undefined): PublishedPackage[] {
  if (!input) return []

  const parsed = JSON.parse(input) as unknown

  if (!Array.isArray(parsed)) {
    throw new Error('PUBLISHED_PACKAGES must be a JSON array')
  }

  return (parsed as unknown[]).map((item) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      !('name' in item) ||
      !('version' in item) ||
      typeof item.name !== 'string' ||
      typeof item.version !== 'string'
    ) {
      throw new Error('PUBLISHED_PACKAGES entries must include string name and version fields')
    }

    return {
      name: item.name,
      version: item.version,
    }
  })
}

function buildReleaseSummary(packages: PublishedPackage[], repository: string) {
  if (packages.length === 0) {
    return 'Package details were not returned by Changesets.'
  }

  return packages
    .map(({ name, version }) => {
      const releaseTag = encodeURIComponent(`${name}@${version}`)
      const packageUrl = `https://github.com/${repository}/releases/tag/${releaseTag}`

      return `- <${packageUrl}|${name}@${version}>`
    })
    .join('\n')
}

export function buildSlackReleasePayload(
  packages: PublishedPackage[],
  repository: string,
): SlackPayload {
  const summary = buildReleaseSummary(packages, repository)

  return {
    text: 'A new Accelerator release was published.',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*:rocket: Accelerator packages published*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: [
            '*:memo: Release Notes*',
            '<https://github.com/noaignite/accelerator/releases|https://github.com/noaignite/accelerator/releases>',
          ].join('\n'),
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*:package: Packages*\n${summary}`,
        },
      },
    ],
  }
}

function writeOutput(name: string, value: string) {
  appendFileSync(getRequiredEnv('GITHUB_OUTPUT'), `${name}=${value}${EOL}`)
}

function main() {
  const packages = parsePublishedPackages(process.env.PUBLISHED_PACKAGES)
  const payload = buildSlackReleasePayload(packages, getRequiredEnv('GITHUB_REPOSITORY'))

  writeOutput('payload', JSON.stringify(payload))
}

const entrypoint = process.argv[1]

if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  main()
}
