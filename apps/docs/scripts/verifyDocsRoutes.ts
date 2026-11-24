import fs from 'node:fs'
import path from 'node:path'
import { findPackagesWithDocs } from '../../../scripts/findPackagesWithDocs.ts'

const rootDir = path.resolve(import.meta.dirname, '../../..')
const manifest = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), '.next/prerender-manifest.json'), 'utf8'),
) as { routes: Record<string, unknown> }
const routes = new Set(Object.keys(manifest.routes).map((route) => route.replace(/\/$/, '') || '/'))
const expected = [
  '/',
  '/Contributing',
  '/Changelog',
  ...findPackagesWithDocs(rootDir).map((name) => `/${name}`),
]
const missing = expected.filter((route) => !routes.has(route))

if (missing.length > 0) {
  throw new Error(
    `Missing prerendered documentation routes: ${missing.map((route) => (route === '/' ? route : `${route}/`)).join(', ')}`,
  )
}

console.info(`Verified ${expected.length} documentation landing routes`)
