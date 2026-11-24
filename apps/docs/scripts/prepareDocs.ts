import { execFileSync } from 'node:child_process'
import path from 'node:path'

// Turbo's docs#build prerequisites already produce complete package artifacts.
// Direct app builds (including hosting providers) need the docs-only task instead.
// eslint-disable-next-line turbo/no-undeclared-env-vars -- Turbo injects its task hash automatically.
if (!process.env.TURBO_HASH) {
  execFileSync('pnpm', ['packages:build-docs'], {
    cwd: path.resolve(import.meta.dirname, '../../..'),
    stdio: 'inherit',
  })
}

await import('../../../scripts/assembleDocsContent.ts')
