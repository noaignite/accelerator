import { spawnSync } from 'node:child_process'
import { appendFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// CI policy is opt-in, even when CI=true. Consume our flag, not Turbo's arguments.
const ci = process.argv.slice(2).includes('--ci')
const args = process.argv.slice(2).filter((arg) => arg !== '--ci')
const env = { ...process.env }

if (!ci) {
  const base = process.env.TURBO_SCM_BASE ?? 'main'
  const head = process.env.TURBO_SCM_HEAD ?? 'HEAD'
  const comparison = spawnSync('git', ['merge-base', base, head], { encoding: 'utf8' })
  const mergeBase = comparison.status === 0 ? comparison.stdout.trim() : ''

  if (mergeBase) {
    // Pin the comparison to the merge-base, not an assumed ancestor target tip.
    env.TURBO_SCM_BASE = mergeBase
    console.error(`Affected validation: ${base}...${head} (merge-base ${mergeBase}).`)
  } else {
    // Invalid comparisons are not empty changesets. Do not retry failed validation as a fallback.
    delete env.TURBO_SCM_BASE
    delete env.TURBO_SCM_HEAD
    console.error(
      `Affected validation: cannot resolve ${base}...${head}; falling back to full validation.`,
    )
  }

  // Keep the existing package-validator scope separate from the unfiltered checks.
  for (const tasks of [
    ['lint', 'test:types', 'test:unit'],
    ['test:package', '--filter=@noaignite/*'],
  ]) {
    const result = spawnSync(
      'pnpm',
      ['exec', 'turbo', ...tasks, ...(mergeBase ? ['--affected'] : []), ...args],
      { env, stdio: 'inherit' },
    )
    if (result.error) console.error(result.error.message)
    if (result.status !== 0) process.exit(result.status ?? 1)
  }
  process.exit(0)
}

function git(...args: string[]) {
  const result = spawnSync('git', args, { encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim() : ''
}

// Never inherit local Turbo comparison defaults for main or a failed PR comparison.
delete env.TURBO_SCM_BASE
delete env.TURBO_SCM_HEAD

// Package qualifiers cannot be wildcards in Turbo. Discover executable validators
// from the full native package scope without narrowing the other checks.
const packageScope = spawnSync(
  'pnpm',
  ['exec', 'turbo', 'run', 'test:package', '--filter=@noaignite/*', '--dry=json'],
  { env, encoding: 'utf8' },
)
if (packageScope.status !== 0) {
  console.error(packageScope.error?.message ?? packageScope.stderr)
  process.exit(packageScope.status ?? 1)
}
const packagePlan: { tasks: { taskId: string; command: string }[] } = JSON.parse(
  packageScope.stdout,
)
const validators = packagePlan.tasks
  .filter((task) => task.taskId.endsWith('#test:package') && task.command !== '<NONEXISTENT>')
  .map((task) => task.taskId)
  .sort()
const checks = ['build', 'lint', 'test:types', ...validators]

let mergeBase = ''
if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
  const base = process.env.PR_BASE_SHA
  const head = process.env.PR_HEAD_SHA
  const baseCommit = base
    ? git('rev-parse', '--verify', '--end-of-options', `${base}^{commit}`)
    : ''
  const headCommit = head
    ? git('rev-parse', '--verify', '--end-of-options', `${head}^{commit}`)
    : ''
  if (baseCommit && headCommit && headCommit === git('rev-parse', 'HEAD')) {
    mergeBase = git('merge-base', baseCommit, headCommit)
  }
  if (mergeBase) {
    env.TURBO_SCM_BASE = mergeBase
    env.TURBO_SCM_HEAD = headCommit
    console.error(
      `PR validation: target ${baseCommit}, head ${headCommit}, merge-base ${mergeBase}.`,
    )
    console.error('PR validation: native affected checks and coverage.')
  } else {
    console.error(
      'PR validation: missing/invalid target or head, unavailable history, or checkout mismatch; falling back to full validation.',
    )
  }
} else {
  console.error('CI validation: non-PR event; full validation without an affected comparison.')
}

// Test prerequisites are dependency builds, not dependency tests. Native affected
// selection still includes consumers when their dependency task inputs change.
const graphs = [[...checks, 'test:coverage', ...(mergeBase ? ['--affected'] : [])]]

for (const tasks of graphs) {
  const result = spawnSync('pnpm', ['exec', 'turbo', 'run', ...tasks, ...args], {
    env,
    stdio: 'inherit',
  })
  if (result.error) console.error(result.error.message)
  // Task failures are not comparison failures: never retry them as a "safe" green fallback.
  if (result.status !== 0) process.exit(result.status ?? 1)
}

// Dry runs describe selected work; they neither produce nor restore reports.
if (args.some((arg) => /^--dry(?:-run)?(?:=|$)/.test(arg))) process.exit(0)

// Discover expected producers from the selected native plan, never from reports
// already on disk: a missing producer directory must fail just like a missing file.
const coverageScope = spawnSync(
  'pnpm',
  [
    'exec',
    'turbo',
    'run',
    'test:coverage',
    ...(mergeBase ? ['--affected'] : []),
    ...args,
    '--dry=json',
  ],
  { env, encoding: 'utf8' },
)
if (coverageScope.status !== 0) {
  console.error(coverageScope.error?.message ?? coverageScope.stderr)
  process.exit(coverageScope.status ?? 1)
}
const coveragePlan: { tasks: { task: string; command: string; directory: string }[] } = JSON.parse(
  coverageScope.stdout,
)
const producers = coveragePlan.tasks.filter(
  (task) => task.task === 'test:coverage' && task.command !== '<NONEXISTENT>',
)
for (const producer of producers) {
  for (const report of ['lcov.info', 'coverage-summary.json']) {
    const path = join(producer.directory, 'coverage', report)
    // types legitimately has an empty LCOV file; require a file, not nonzero size.
    if (!statSync(path, { throwIfNoEntry: false })?.isFile()) {
      console.error(`::error file=${path}::Missing selected coverage report`)
      process.exit(1)
    }
  }
}
const scope = mergeBase ? 'affected' : 'full'
const files = producers.map((producer) => join(producer.directory, 'coverage', 'lcov.info'))
console.error(`Verified ${scope} coverage for ${producers.length} selected producers.`)
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `coverage-count=${producers.length}\ncoverage-files=${files.join(',')}\ncoverage-scope=${scope}\n`,
  )
}
const summary = producers.length
  ? `Coverage: ${scope}; ${producers.length} selected producers verified. Upload only these reports; ${
      mergeBase
        ? 'the 90% patch gate applies, not the full-project gate'
        : 'the full-project gate applies'
    }.`
  : 'Coverage: no selected producers. No upload or Codecov status requested; this is not a passing coverage measurement.'
console.error(summary)
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`)
}
