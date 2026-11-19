import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import { compatibilityKey, pruneSnapshot } from './turboCache.ts'

test('cache compatibility never falls back across runtime, image, platform, year or schema', () => {
  const environment = {
    node: 'v24.15.0',
    platform: 'linux',
    architecture: 'x64',
    imageOS: 'ubuntu24',
    imageVersion: '20261115.1',
    year: 2026,
    schema: 1,
  }
  assert.equal(
    compatibilityKey(environment),
    'turbo-v1-linux-x64-ubuntu24-20261115.1-node24.15.0-2026-',
  )
  for (const [field, value] of Object.entries({
    node: 'v24.16.0',
    platform: 'darwin',
    architecture: 'arm64',
    imageOS: 'ubuntu26',
    imageVersion: '20261116.1',
    year: 2027,
    schema: 2,
  })) {
    assert.notEqual(
      compatibilityKey({ ...environment, [field]: value }),
      compatibilityKey(environment),
    )
  }
  assert.throws(() => compatibilityKey({ ...environment, imageVersion: '' }))
})

test('snapshots retain only task archives referenced by this job, never historical entries', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'turbo-snapshot-'))
  try {
    const active = '1234567890abcdef'
    const stale = 'fedcba0987654321'
    for (const hash of [active, stale]) {
      await writeFile(path.join(directory, `${hash}.tar.zst`), 'archive')
      await writeFile(path.join(directory, `${hash}-meta.json`), '{}')
    }
    const result = await pruneSnapshot(directory, [{ tasks: [{ hash: active }] }], 1024)
    assert.deepEqual((await readdir(directory)).sort(), [
      `${active}-meta.json`,
      `${active}.tar.zst`,
    ])
    assert.equal(result.bytes, 9)
    assert.equal(result.save, true)
    assert.equal(await readFile(path.join(directory, `${active}.tar.zst`), 'utf8'), 'archive')
    assert.equal((await pruneSnapshot(directory, [{ tasks: [{ hash: active }] }], 1)).save, false)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('missing run evidence disables saving instead of preserving stale history', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'turbo-snapshot-'))
  try {
    await writeFile(path.join(directory, '1234567890abcdef.tar.zst'), 'archive')
    await assert.rejects(pruneSnapshot(directory, [], 1024), /summaries/)
    await assert.rejects(
      pruneSnapshot(directory, [{ tasks: [{ hash: '../outside' }] }], 1024),
      /summaries/,
    )
    assert.deepEqual(await readdir(directory), ['1234567890abcdef.tar.zst'])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
