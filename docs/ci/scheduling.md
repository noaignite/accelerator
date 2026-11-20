# CI scheduling and cancellation

The test workflow uses one standard `ubuntu-latest` job. Main and invalid PR
comparisons use one native Turbo graph for build, lint, types, coverage and
public-package validators. Independent tasks overlap instead of waiting for
whole phases. Valid PRs use affected checks followed by full coverage; see
[PR selection](affected-selection.md#pr-validation).

`turbo.json` owns prerequisite ordering: docs lint/types wait for docs build;
docs build waits for all ten package builds; validators wait for their own and
dependency builds and remain uncached. `scripts/testAffected.ts --ci` discovers
package-qualified validators from the full native
`test:package --filter=@noaignite/* --dry=json` plan. Added/removed validators
need no runner-list maintenance; planning failure fails validation. Wildcard
package task qualifiers are unsupported by Turbo 2.11, while a graph-wide
package filter would incorrectly narrow other checks.

Turbo owns selection and execution. Do not use `--only` or `--parallel` to bypass
prerequisites. Formatting/changeset checks stay repository-wide. Local `build`,
`test` and `ci:test` retain their ordering/scope. Release commands, authentication,
notifications and isolation from test-cache restoration remain unchanged.

## Complete coverage, including cache hits

All five current producers run or restore complete `coverage/**` outputs:
react-centra-checkout, react-utils, tailwind-typography, types and utils. CI
discovers executable producers from the full native coverage plan and requires
each LCOV and JSON summary, including newly added producers. Types legitimately
has empty LCOV; existence, not nonzero size, is required.

Coverage/Codecov project and patch requirements are unchanged. Upload skips
Dependabot and otherwise uses `fail_ci_if_error: true`. No carryforward,
affected-only coverage or passing empty-upload shortcut is used. Task failures
and missing reports fail; cache transport failures retain execution fallback.

## Only the same PR can cancel a run

Concurrency groups include workflow name, event name and PR number. A newer run
can cancel obsolete pending/in-progress work for that same PR, including forks.
Different PRs have different groups. Main uses unique run IDs and
`cancel-in-progress: false`: a shared main group could still replace pending runs.
Release remains a separate unchanged workflow.

The job name remains `test-and-coverage`. Canceled obsolete commits do not count
as success for the newest commit, which must complete validation and applicable
coverage checks. Required branch-protection checks need independent verification.

## Reproducing the scheduling comparison

Use an installed disposable checkout with matching revision/runtime. Set
`CI=true`, `HUSKY=0`, `TURBO_CACHE=local:rw` and an explicit external
`TURBO_CACHE_DIR`, initially empty and different for each cold variant. Never
delete a shared worktree cache. Installation is outside command timing.

Sequential reference:

```sh
pnpm build && pnpm format:check && pnpm ci:test
```

Current full combined graph (the push event selects full scope):

```sh
GITHUB_EVENT_NAME=push pnpm ci:test:affected && pnpm format:check
```

Use `/usr/bin/time -p`. Start cold without generated package `dist`/`coverage`,
docs `.next`/`next-env.d.ts`/`src/content`/`public/_pagefind` or incremental
TypeScript state. Before warm repeats, move outputs aside, retain the variant's
cache, and compare restored bytes with its fresh outputs. The workflow formats
first for early failure feedback; include the same formatting work in comparisons.

Inspect public plans using `--dry=json`. Compare executable task IDs (excluding
`<NONEXISTENT>` transit nodes), prerequisites, coverage outputs and validator
cache settings, not incidental log order. See [CI plan commands](affected-selection.md#inspecting-ci-plans).

## Recorded evidence and limitations

Local measurements used Apple M1 Max (10 logical CPUs, 64 GiB), macOS arm64,
Node 24.15.0, pnpm 11.3.0 and Turbo 2.11.11. **One** completed sample per cell,
sequential cold/warm before combined cold/warm:

| Variant    | Cold command | Warm command | Cache behavior                                                     |
| ---------- | -----------: | -----------: | ------------------------------------------------------------------ |
| Sequential |      90.83 s |      14.92 s | Cold build 0/11 hits; warm cacheable work hits; validators execute |
| Combined   |      51.11 s |       8.26 s | Cold 0/36 hits; warm 32/36 hits; four validators execute           |

Both selected 36 executable tasks: 11 builds, seven lint, nine types, five
coverage and four validators. Fresh runs passed 71 test files / 367 tests.
All five LCOV/summary pairs matched across variants. Package/generated-docs/search
outputs were equivalent apart from coverage HTML timestamps; independent Next
build identifiers can differ. Each warm variant restored its own 1,849 recorded
outputs byte-for-byte, including 314 coverage files, without `.next/cache`.
Missing-report and task-failure checks failed as required.

These shared-host samples support simpler combined scheduling locally, **not a
GitHub-runner or push-to-green speedup**. OS caches were not flushed;
setup/transfers/upload/queueing were excluded. One sample establishes no variance
or tail latency.

Historical Actions context, one reference per state:

| Sequential reference                                                            | Created → job start | Job execution / runner occupancy | Created → job end |
| ------------------------------------------------------------------------------- | ------------------: | -------------------------------: | ----------------: |
| [Build cold](https://github.com/noaignite/accelerator/actions/runs/44722393509) |                 3 s |                            165 s |             168 s |
| [Cache warm](https://github.com/noaignite/accelerator/actions/runs/44723581955) |                 2 s |                             39 s |              41 s |

Cold build had 0/11 hits; later phases reused prerequisites. Warm reused cacheable
work but reran validators. Images/Node patches differed: these are not controlled
comparisons. Created-to-start is a scheduling proxy, created-to-end is not
push-to-all-required-green, and occupancy is elapsed job time, not billed minutes.

Details are in the [#907 evidence archive](https://github.com/noaignite/accelerator/issues/907#issuecomment-7049279614).
After authorized publication, comparable cold/warm Actions runs, queue/setup/cache
transfer/upload/runner usage, push-to-required-green/useful-failure timings,
main/PR/fork reports/statuses and successive-commit cancellation still need
verification. No test branch was pushed or workflow dispatched for this evidence.
