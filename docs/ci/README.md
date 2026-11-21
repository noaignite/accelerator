# CI: selection, reuse and evidence

The test pipeline uses native Turbo graphs on one standard GitHub-hosted runner.
Local correctness checks are available; controlled Actions push-to-green
acceptance and Remote Cache provisioning remain pending. **No runner speedup or
server-side cache policy is claimed from local tests.**

## What runs

| Context                                                  | Validation                                                          | Cache access                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Existing local `pnpm build`, `pnpm test`, `pnpm ci:test` | Existing full scope and ordering                                    | Ordinary local defaults; no automatic remote linking                                      |
| Opt-in `pnpm test:affected`                              | Affected lint/types/unit and package validators, with prerequisites | No remote authentication added                                                            |
| Valid PR, including a non-main target                    | Affected build/lint/types/package graph, then **full** coverage     | Credential-free Turbo filesystem cache restored through GitHub                            |
| Main push or invalid PR comparison                       | One full build/lint/types/coverage/package graph                    | Same credential-free cache                                                                |
| Fork PR                                                  | Same validation as other PRs                                        | Restore only; no Turbo remote credentials or federation                                   |
| Release                                                  | Unchanged full build/test/publish chain                             | No test-workflow task-cache restoration or federation; intra-job reuse remains legitimate |

Formatting stays repository-wide. Changeset policy, strict package validators,
coverage thresholds and applicable Codecov failure behavior are unchanged.
The job is still named `test-and-coverage`; this does not establish which checks
branch protection requires.

**Selection is not caching.** Selection chooses tasks; caching can reuse selected
results. Unselected tasks do not restore outputs. Selected validators always
execute. Docs generation brings all ten package builds into some affected graphs;
full coverage has five prerequisite builds. Thus zero affected CI checks still
select ten coverage/build tasks, unlike a legitimate local zero-task result.

### Local feedback

```sh
pnpm test
pnpm format:check

# Optional: fetch your intended target first.
TURBO_SCM_BASE=origin/my-target pnpm test:affected
TURBO_SCM_BASE=HEAD pnpm test:affected --dry-run=json
```

The opt-in command defaults to local `main` and head `HEAD`, resolves their actual
merge-base, and accepts `TURBO_SCM_BASE`/`TURBO_SCM_HEAD` overrides. Staged,
unstaged and nonignored untracked edits participate **even with an explicit
head**; use a clean checkout for a committed-only comparison. Invalid or empty
explicit refs visibly fall back to full validation. Task failures fail immediately
without a fallback retry.

The workflow uses `pnpm ci:test:affected` (`node ./scripts/testAffected.ts --ci`).
Only explicit `--ci` selects CI policy: `CI=true pnpm test:affected` still uses
local unit-only validation. PR CI uses actual event base/head snapshots and
verifies the checkout head; non-PR events run full validation. See
[affected selection](affected-selection.md) for commands and scope.

### Coverage and trust boundaries

CI discovers executable validators from Turbo's full package-filtered plan and
coverage producers from its full coverage plan, not hardcoded lists or existing
files. Every producer must supply `lcov.info` and `coverage-summary.json` after
execution/restoration. Currently there are five: react-centra-checkout, react-utils,
tailwind-typography, types and utils. Empty LCOV is legitimate for types; missing
reports fail. Dry runs inspect plans only. No carryforward or partial upload is
used. Codecov still skips Dependabot and otherwise has `fail_ci_if_error: true`;
actual fork upload/status behavior remains an Actions gate.

Only newer runs of the **same PR** can cancel older runs. Unique main-push groups
avoid replacing pending main work; release remains separate. Cancellation is not
success for the newest commit. See [scheduling](scheduling.md).

Test CI uses `TURBO_CACHE=local:rw`; remote federation remains inactive. GitHub
cache service failures are nonfatal to cache steps, but validation still runs.
This configuration is not an observed outage test. No OIDC permission or Vercel
credential was added. Cached artifacts include logs: never put secrets in them.
See [cache trust and Owner setup](cache.md). If exact main-test-workflow writer
policy, server-denied PR writes and fork/release exclusion cannot be verified,
retain the credential-free fallback.

## Benchmark summary

These separate experiments are not a pooled benchmark; each state has only one
completed sample. Detailed local evidence is archived on
[#907](https://github.com/noaignite/accelerator/issues/907) in the
[evidence comment](https://github.com/noaignite/accelerator/issues/907#issuecomment-7049279614).

| Evidence                                                                                 | Result and interpretation                                                                                      |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Historical Actions, one build-cold and one warm reference                                | 165/39 s job occupancy; 168/41 s run-created-to-job-end. Runtime/image differences; not push-to-required-green |
| Local sequential vs combined scheduling, one cold/warm sample per variant                | 90.83/14.92 s vs 51.11/8.26 s; supports combined scheduling locally, not an Actions speedup                    |
| Local full vs leaf affected + coverage, one cold/warm sample per variant                 | 51.74/6.73 s vs 49.39/7.03 s; fewer checks, **no established latency gain**                                    |
| Integrated full vs leaf-README restoration smoke test, one fresh/warm sample per variant | 49.87/7.17 s vs 50.70/7.28 s; restoration evidence only                                                        |

Local checks used macOS arm64, Node 24.15.0, pnpm 11.3.0 and Turbo 2.11.11.
Fresh full and affected runs passed 71 test files / 367 tests and selected strict
validators. Warm repeats after moving generated outputs aside restored all 1,849
recorded files byte-for-byte, including 314 coverage files; all five report pairs
were verified. Full runs had 36 tasks and four uncached validators. These shared-host
command measurements exclude installation, formatting, queueing, transfers and
uploads; OS/filesystem caches were not flushed. They establish neither variance
nor runner speedup.

Affected selection reduces verified scope, not necessarily latency. Full coverage
and two invocations constrain gains. These measurements do not justify job
splitting, partial coverage, larger runners or custom scheduling.

## Integrated acceptance matrix

“Local” means command/static evidence, **not observed Actions behavior**.

| Scenario                             | Local correctness evidence                                                                                           | Outstanding actual-service evidence                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Main                                 | Full 36-task plan and execution; no affected comparison                                                              | Main run, complete upload and required statuses                                                   |
| PR/non-main target                   | Actual target merge-base; leaf/shared/root-doc selection and full coverage                                           | Non-main-target PR run and required checks                                                        |
| Valid zero/minimal PR                | Zero affected tasks plus ten coverage/build tasks; execution/restoration                                             | Controlled cold/warm minimal PR and upload/status                                                 |
| Invalid comparison/checkout mismatch | Visible full fallback; 36-task plans and invalid-base execution                                                      | Authorized invalid-history Actions case                                                           |
| Fresh/cached outputs                 | Full/leaf execution and byte-identical warm restoration                                                              | GitHub archive transfer and Codecov reports                                                       |
| Native discovery/failures            | Added validators discovered; task/planning failures propagate; missing producer/report rejected; empty LCOV accepted | Actual failing task/upload status and useful-feedback timing                                      |
| Fork                                 | Same unprivileged validation; no remote auth; save excludes forks                                                    | Real fork validation/cache/upload/status behavior                                                 |
| Cancellation                         | Same-PR groups, unique main groups, separate release                                                                 | Successive PR commits; other PR/main/release unaffected; newest checks finish                     |
| Cache miss/outage                    | Fresh local-only execution passes; federation absent                                                                 | Actual archive outage; Owner-approved remote failure tests before activation                      |
| Release isolation                    | Workflow unchanged; no test cache/federation/cancellation added                                                      | Authorized release observation; no publishing performed                                           |
| Federation policy                    | Hash invalidation and Owner gate documented; no policy provisioned                                                   | Main writer; server-denied PR writes; fork/release/wrong-workflow exclusion; broader-policy audit |

## Completing the benchmark after authorization

Publication, PR/test-branch creation, workflow dispatch and Owner provisioning
are not authorized by this work. Actions acceptance remains pending.

After explicit approval:

1. Record commit/workflow, target merge-base, runner image/architecture,
   Node/pnpm/Turbo versions, cache configuration and required-check inventory.
   Compare only matching runtime/scenario/cache cohorts.
2. Exercise leaf, shared config, generated-docs and valid zero/minimal cases.
   Separate cold task caches from dependency/OS caches and legitimate intra-job
   prerequisite hits; repeat warm with identical inputs.
3. Record observed push/event receipt, run URL/attempt/head SHA, job start/end,
   every required check's final completion, selected tasks, hit/miss counts and
   setup/auth/restore/save/upload durations. Commit author time is not push time.
4. Report push-to-last-required-green separately from run-created-to-job-start
   (a scheduling proxy), job execution and summed occupancy (not billed minutes).
   Mark push-to-green unavailable without a reliable push timestamp and complete
   required-check set. State sample sizes, failures, retries and cancellations;
   measure useful failure from the same push to first actionable feedback.
5. Complete every service gate above before claiming benefit or activating
   federation. Never retry or ignore ordinary task/coverage failures as cache fallback.
