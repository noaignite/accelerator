# Local affected validation

`pnpm test:affected` is an opt-in counterpart to `pnpm test`: lint, types and
unit tests, then existing `@noaignite/*` artifact validators. Turbo keeps all
prerequisite builds, including docs build before docs lint/types. It does not
upload coverage or authenticate to remote caching. Run `pnpm format:check`
separately, repository-wide. Existing full-scope commands remain unchanged.

## Comparisons and local edits

```sh
pnpm test:affected
TURBO_SCM_BASE=origin/my-target pnpm test:affected
TURBO_SCM_BASE=HEAD pnpm test:affected --dry-run=json
TURBO_SCM_BASE=origin/my-target TURBO_SCM_HEAD=my-commit pnpm test:affected
```

Default base is local `main`, head is `HEAD`. Fetch the intended target first
when necessary; the command never fetches or assumes all branches target main.
The wrapper resolves and logs the actual merge-base. Overrides accept branches,
remote-tracking refs or commits, including non-main targets.

Turbo includes staged, unstaged and nonignored untracked files **even with an
explicit `TURBO_SCM_HEAD`**. Ignored build outputs do not count. An explicit head
changes the committed comparison, not local-edit inclusion; use a clean checkout
for committed-only plans. Zero tasks on a valid empty comparison or unrelated
document change is success, not a full-repository health check. Use `pnpm test`
for that. Root contributor documents are docs inputs and may select docs work.

Unresolved refs or missing merge-base history visibly print
`falling back to full validation` and run both existing scopes without
`--affected`. Empty explicit refs are invalid, not defaults. Valid empty plans
do not fall back. Task failures and post-preflight Turbo/comparison errors fail
immediately, never triggering a retry that could hide failure.

Arguments such as `--dry-run=json` and `--cache=local:rw` are forwarded to both
invocations. JSON dry runs print **two plan objects**, not one JSON document
(plus pnpm's banner). To inspect individual native plans:

```sh
TURBO_SCM_BASE=HEAD pnpm exec turbo lint test:types test:unit --affected --dry-run=json
TURBO_SCM_BASE=HEAD pnpm exec turbo test:package --filter='@noaignite/*' --affected --dry-run=json
```

Direct commands lack the wrapper's invalid-ref fallback. Do not use `--only` or
`--parallel` to bypass prerequisites.

## Why task inputs, not just changed packages?

`futureFlags.affectedUsingTaskInputs` follows generated-docs edges that
package-level selection misses, including package README inputs. Keep
`$TURBO_DEFAULT$` and shared helper inputs; add each new documented package to
both `docs#build` and `docs#dev` prerequisites.

Root `package.json`, workspace config and root/scripts TypeScript configs are
conservative global inputs; Turbo also handles task config and lockfiles
conservatively. Correctness takes priority over the smallest plan.

Selection and caching are independent. Unselected tasks do not restore outputs.
Docs can bring all ten package builds into a leaf graph. Selected validators
remain `cache: false`, depend on their own and dependency builds, and retain
their strict publint/ATTW commands and profiles.

## Behavioral evidence

The local command/public Turbo JSON-plan seam verified the following scenarios.
Counts exclude `<NONEXISTENT>` transit nodes and include prerequisites; local
counts are the union of two invocations. They describe the verified configuration,
not permanent counts to hardcode into a runner.

| Changed input                                                      | Local executable tasks | CI affected tasks (plus ten full-coverage/build tasks) |
| ------------------------------------------------------------------ | ---------------------: | -----------------------------------------------------: |
| Tailwind-typography source or README                               |                     22 |                                                     19 |
| Utils source and its consumers                                     |                     34 |                                                     29 |
| Shared style guide                                                 |                     36 |                                                     31 |
| Shared Vitest helper                                               |                     32 |                                                     27 |
| Shared tsdown/package-docs/docsUtils helper                        |                     36 |                                                     31 |
| Root README/CONTRIBUTING or docs source                            |                     13 |                                                     13 |
| Root/scripts TypeScript config, Turbo/workspace config or lockfile |                     36 |                                                     31 |
| Root package manifest                                              |                     36 |                                                     31 |
| Unrelated agent document or clean comparison                       |                      0 |                                                      0 |

Staged, unstaged and nonignored untracked leaf edits each selected work, including
with explicit head; ignored outputs did not. Non-main targets used the actual
merge-base. Invalid/empty refs, unavailable merge-base and CI checkout mismatch
selected full fallback, not zero success. Simulated main selected the full graph.
Task failures propagated without fallback or execution of the next graph.
Selected validators retained uncached execution and required builds.

Fresh full and leaf execution passed 71 files / 367 tests and selected validators.
Warm restoration and five complete coverage report pairs were checked; omitted
reports/producers failed, while empty LCOV was accepted. Added validators were
discovered without a runner-list change. See the
[evidence archive](https://github.com/noaignite/accelerator/issues/907#issuecomment-7049279614)
on [#907](https://github.com/noaignite/accelerator/issues/907) for detailed local
checks. This is correctness evidence, not observed Actions behavior.

## PR validation

The workflow uses `pnpm ci:test:affected` (`node ./scripts/testAffected.ts --ci`).
Only `--ci` selects CI policy; `CI=true pnpm test:affected` still runs local
unit checks. `pnpm ci:test` remains unchanged and full-scope.

CI checks out the PR head with full history and supplies event
`pull_request.base.sha` and `head.sha`. These are actual snapshots, including
non-main targets, not moving branch tips. The script resolves commits, verifies
head matches checkout, pins the merge-base/head and logs them. Missing/empty
refs, unavailable history/merge-base or mismatch visibly fall back to one full
build/lint/types/coverage/package graph. Non-PR events use that full graph without
comparing main to itself. Task failure is never a fallback condition.

For valid PRs, a native affected graph selects builds, lint, types and
package-qualified validators discovered from executable tasks in the full native
`test:package --filter=@noaignite/* --dry=json` plan. Added/removed validators
need no second list; native planning failure fails validation.

The next invocation selects **all coverage tasks**, restoring valid cached
reports and executing misses. Producers/workspace paths come from the full
native `test:coverage --dry=json` plan, excluding nonexistent transit tasks,
not report files already on disk. After execution, each producer must have
`coverage/lcov.info` and `coverage/coverage-summary.json`. Missing directories
cannot silently disappear; empty LCOV is allowed. Dry runs inspect plans only.
The existing workflow presence gate and Codecov behavior remain intact.

Forks use identical validation without remote credentials; cache saving excludes
forks. Formatting remains repository-wide; release and changeset policy do not change.

### Why two native invocations on valid PRs?

Turbo's affected filter applies to **every entrypoint**, even package-qualified
coverage. One affected graph could silently omit unaffected reports. Two native
invocations retain complete coverage without a custom detector, scheduler or
partial-upload scheme. Coverage follows affected checks rather than overlapping
them: a deliberate safety/complexity trade-off, not a promise of lower latency.
Main/invalid comparisons retain one full graph.

A genuine zero affected plan still selects five coverage producers and their
five build prerequisites (ten tasks), distinguishable from full fallback's 36.

### Inspecting CI plans

```sh
GITHUB_EVENT_NAME=push pnpm ci:test:affected --dry-run=json
GITHUB_EVENT_NAME=pull_request PR_BASE_SHA=HEAD PR_HEAD_SHA=HEAD \
  pnpm ci:test:affected --dry-run=json
GITHUB_EVENT_NAME=pull_request PR_BASE_SHA=missing-ref PR_HEAD_SHA=HEAD \
  pnpm ci:test:affected --dry-run=json
```

Valid PRs print two objects, full runs one. Working-tree edits still participate;
`HEAD`/`HEAD` is zero only in a clean checkout without relevant local edits.

### Local timing, not Actions acceptance

One sample per cell used macOS arm64, Node 24.15.0, pnpm 11.3.0, Turbo 2.11.11
and separate initially empty local-only task caches. Full preceded leaf; leaf
used an inert source comment. Outputs were moved aside before warm repeats.

| Variant                       |    Cold |   Warm |
| ----------------------------- | ------: | -----: |
| Single full graph             | 51.74 s | 6.73 s |
| Leaf affected + full coverage | 49.39 s | 7.03 s |

Full had 36 tasks (0/32 cold/warm hits) and four uncached validators. Leaf checks
had 19 tasks (0/18 hits), then ten coverage/build tasks (5/10 hits); fresh coverage
legitimately reused five builds from affected checks. Command-only timing excludes
formatting, installation, queueing, transfers and uploads. Shared-host OS caches
were not flushed. Fewer checks establish **no latency gain or runner speedup**.

Real non-main PR/main/fork/invalid-baseline runs, upload/required statuses,
cancellation and comparable push-to-green/useful-failure timings remain
publication-gated. Remote authorization requires separate Owner/server-policy
evidence. See the [acceptance matrix](README.md#integrated-acceptance-matrix).
