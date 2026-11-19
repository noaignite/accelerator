import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'

// Test the resolved hashes, not the spelling of Turbo's configuration.
const root = fileURLToPath(new URL('../', import.meta.url))
const temporaryRoot = path.join(tmpdir(), 'opencode')
mkdirSync(temporaryRoot, { recursive: true })
const fixture = mkdtempSync(path.join(temporaryRoot, 'turbo-cache-'))
const turbo = path.join(root, 'node_modules/turbo/bin/turbo')
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
for (const file of tracked.split('\0').filter(Boolean)) {
  const destination = path.join(fixture, file)
  mkdirSync(path.dirname(destination), { recursive: true })
  copyFileSync(path.join(root, file), destination)
}
// Include the working configuration even when this test is not yet tracked.
copyFileSync(path.join(root, 'turbo.json'), path.join(fixture, 'turbo.json'))
copyFileSync(fileURLToPath(import.meta.url), path.join(fixture, 'scripts/turboConfig.test.ts'))
execFileSync('git', ['init', '--quiet'], { cwd: fixture })
execFileSync('git', ['add', '.'], { cwd: fixture })
after(() => rmSync(fixture, { recursive: true, force: true }))

type Task = {
  taskId: string
  command: string
  hash: string
  inputs: Record<string, string>
  dependencies: string[]
  outputs: string[]
  excludedOutputs: string[]
  cache: { status: string }
  resolvedTaskDefinition: { cache: boolean }
}
type Plan = { tasks: Task[]; globalCacheInputs: { files: Record<string, string> } }

function plan(): Plan {
  return JSON.parse(
    execFileSync(
      process.execPath,
      [
        turbo,
        'run',
        'build',
        'build:docs',
        'lint',
        'test:types',
        'test:coverage',
        'test:unit',
        'test:package',
        '--dry=json',
        '--cache-dir',
        path.join(fixture, '.turbo/test-cache'),
      ],
      {
        cwd: fixture,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, TURBO_TELEMETRY_DISABLED: '1' },
      },
    ),
  )
}

function task(result: Plan, id: string): Task {
  const found = result.tasks.find((entry) => entry.taskId === id)
  assert.ok(found, `Missing task ${id}`)
  return found
}

const baseline = plan()

function changed(file: string, run: (before: Plan, after: Plan) => void) {
  const absolute = path.join(fixture, file)
  const original = readFileSync(absolute, 'utf8')
  try {
    const comment = file.endsWith('.yaml') ? '#' : '//'
    writeFileSync(absolute, `${original}\n${comment} Cache regression probe\n`)
    run(baseline, plan())
  } finally {
    writeFileSync(absolute, original)
  }
}

test('package builds invalidate when shared build and documentation helpers change', () => {
  for (const helper of ['getTsdownConfig.ts', 'buildPackageDocs.ts', 'docsUtils.ts']) {
    changed(`scripts/${helper}`, (before, after) => {
      assert.notEqual(
        task(before, '@noaignite/utils#build').hash,
        task(after, '@noaignite/utils#build').hash,
        helper,
      )
    })
  }
})

test('standalone docs and Vitest tasks invalidate for their shared helpers', () => {
  for (const helper of ['buildPackageDocs.ts', 'docsUtils.ts', 'getVitestConfig.ts']) {
    changed(`scripts/${helper}`, (before, after) => {
      const tasks =
        helper === 'getVitestConfig.ts' ? ['test:unit', 'test:coverage'] : ['build:docs']
      for (const name of tasks) {
        const id = `@noaignite/utils#${name}`
        assert.notEqual(task(before, id).hash, task(after, id).hash, `${helper}: ${id}`)
      }
    })
  }
  assert.ok(task(baseline, '@noaignite/utils#test:coverage').outputs.includes('coverage/**'))
})

test('checks retain upstream check dependencies and include build provenance', () => {
  const result = baseline
  for (const name of ['lint', 'test:types', 'test:unit', 'test:coverage']) {
    const dependencies = task(result, `@noaignite/react-utils#${name}`).dependencies
    assert.ok(dependencies.includes('@noaignite/utils#build'), `${name}: upstream build`)
    assert.ok(dependencies.includes(`@noaignite/utils#${name}`), `${name}: upstream check`)
  }
  for (const name of ['lint', 'test:types']) {
    assert.ok(task(result, `docs#${name}`).dependencies.includes('docs#build'))
  }
  for (const helper of ['getTsdownConfig.ts', 'getVitestConfig.ts']) {
    changed(`scripts/${helper}`, (before, after) => {
      for (const name of ['lint', 'test:types']) {
        const id = `@noaignite/utils#${name}`
        assert.notEqual(task(before, id).hash, task(after, id).hash, `${helper}: ${name}`)
      }
    })
  }
})

test('root installation policy invalidates every task hash', () => {
  changed('pnpm-workspace.yaml', (before, after) => {
    for (const entry of before.tasks) {
      assert.notEqual(entry.hash, task(after, entry.taskId).hash, entry.taskId)
    }
    assert.ok(Object.keys(after.globalCacheInputs.files).includes('pnpm-workspace.yaml'))
  })
})

test('shared lint and TypeScript configuration stays in the root workspace dependency hash', () => {
  for (const file of [
    'packages/style-guide/typescript/tsconfig.base.json',
    'packages/style-guide/eslint/base.js',
  ]) {
    changed(file, (before, after) => {
      for (const entry of before.tasks) {
        assert.notEqual(entry.hash, task(after, entry.taskId).hash, `${file}: ${entry.taskId}`)
      }
    })
  }
})

test('docs build declares restorable outputs but excludes ephemeral Next state', () => {
  const docs = task(baseline, 'docs#build')
  for (const output of ['.next/**', 'next-env.d.ts', 'public/_pagefind/**', 'src/content/**']) {
    assert.ok(docs.outputs.includes(output), `Missing output ${output}`)
  }
  for (const excluded of ['.next/cache/**', '.next/dev/**']) {
    assert.ok(docs.excludedOutputs.includes(excluded), `Missing exclusion ${excluded}`)
  }
  for (const name of [
    'centra-mocks',
    'centra-types',
    'create-app',
    'react-centra-checkout',
    'react-native-eslint',
    'react-utils',
    'style-guide',
    'tailwind-typography',
    'types',
    'utils',
  ]) {
    assert.ok(docs.dependencies.includes(`@noaignite/${name}#build`), name)
  }
})

test('default source inputs invalidate own and consuming workspace tasks', () => {
  changed('packages/utils/src/assert.ts', (before, after) => {
    for (const name of [
      'build',
      'build:docs',
      'lint',
      'test:types',
      'test:unit',
      'test:coverage',
    ]) {
      for (const pkg of ['utils', 'react-utils']) {
        const id = `@noaignite/${pkg}#${name}`
        assert.notEqual(task(before, id).hash, task(after, id).hash, id)
      }
    }
    assert.notEqual(task(before, 'docs#build').hash, task(after, 'docs#build').hash)
  })
})

test('docs-only inputs invalidate docs checks without invalidating package builds', () => {
  for (const file of [
    'README.md',
    'scripts/assembleDocsContent.ts',
    'apps/docs/src/app/layout.tsx',
  ]) {
    changed(file, (before, after) => {
      for (const name of ['build', 'lint', 'test:types']) {
        assert.notEqual(task(before, `docs#${name}`).hash, task(after, `docs#${name}`).hash, file)
      }
      const id = '@noaignite/utils#build'
      assert.equal(task(before, id).hash, task(after, id).hash, file)
    })
  }
})

test('generated outputs and cache-regression tests do not become source inputs', () => {
  const before = baseline
  const artifacts = [
    'apps/docs/src/content/probe.mdx',
    'apps/docs/.next/types/probe.d.ts',
    'apps/docs/.next/cache/probe',
    'apps/docs/.next/dev/probe',
    'apps/docs/next-env.d.ts',
    'apps/docs/public/_pagefind/probe.js',
    'packages/utils/dist/probe.js',
    'packages/utils/coverage/probe.json',
  ]
  try {
    for (const file of artifacts) {
      const destination = path.join(fixture, file)
      mkdirSync(path.dirname(destination), { recursive: true })
      writeFileSync(destination, 'Generated output\n')
    }
    const after = plan()
    for (const entry of before.tasks) {
      assert.equal(entry.hash, task(after, entry.taskId).hash, entry.taskId)
    }
  } finally {
    for (const file of artifacts) rmSync(path.join(fixture, file))
  }
  changed('scripts/turboConfig.test.ts', (before, after) => {
    for (const entry of before.tasks) {
      assert.equal(entry.hash, task(after, entry.taskId).hash, entry.taskId)
    }
  })
})

test('all four package validation tasks remain uncached', () => {
  const validations = baseline.tasks.filter(
    (entry) => entry.taskId.endsWith('#test:package') && entry.command !== '<NONEXISTENT>',
  )
  assert.equal(validations.length, 4)
  for (const entry of validations)
    assert.equal(entry.resolvedTaskDefinition.cache, false, entry.taskId)
})
