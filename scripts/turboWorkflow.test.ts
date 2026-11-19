import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import vm from 'node:vm'

const workflow = await readFile(new URL('../.github/workflows/test.yml', import.meta.url), 'utf8')
function stepBody(name: string) {
  const body = workflow.split(`      - name: ${name}\n`)[1]
  assert.ok(body, `Missing workflow step: ${name}`)
  return body.split('      - name:')[0]!
}

const saveStep = stepBody('Save Turbo tasks')
// This guard uses only operators shared by Actions expressions and JavaScript.
// Exercise the actual workflow expression, not a second implementation of the policy.
const expression = saveStep
  .match(/\$\{\{([\s\S]*?)\}\}/)![1]!
  .replace(/\.([\w]+-[\w-]+)/g, "['$1']")
const maySave = (
  event: string,
  headRepository: string,
  { success = true, hit = false, withinLimit = true } = {},
) =>
  vm.runInNewContext(expression, {
    github: {
      event_name: event,
      repository: 'noaignite/accelerator',
      event: { pull_request: { head: { repo: { full_name: headRepository } } } },
    },
    steps: {
      'turbo-snapshot': {
        outcome: success ? 'success' : 'failure',
        outputs: { save: String(withinLimit) },
      },
      'turbo-restore': { outputs: { 'cache-hit': String(hit) } },
    },
  }) as boolean

test('only successful main and same-repository PR jobs can save a new bounded snapshot', () => {
  assert.equal(maySave('push', ''), true)
  assert.equal(maySave('pull_request', 'noaignite/accelerator'), true)
  assert.equal(maySave('pull_request', 'contributor/accelerator'), false)
  assert.equal(maySave('pull_request', 'noaignite/accelerator', { success: false }), false)
  assert.equal(maySave('push', '', { withinLimit: false }), false)
  assert.equal(maySave('push', '', { hit: true }), false)
})

test('cache restore and save cannot filter or suppress the full sequential checks', () => {
  const build = stepBody('Run build')
  const checks = stepBody('Run tests with coverage')
  assert.equal(build.trim(), 'run: pnpm build')
  assert.equal(checks.trim(), 'run: pnpm ci:test')
  assert.ok(workflow.indexOf('run: pnpm build') < workflow.indexOf('run: pnpm ci:test'))
  assert.ok(workflow.includes('restore-keys: ${{ steps.turbo-key.outputs.prefix }}'))
  assert.ok(!workflow.includes('pull_request_target'))
  assert.ok(!workflow.includes('--affected'))
})
