# CI cache trust and compatibility

## Current state: credential-free fallback

Remote federation is **not activated**. A Vercel team Owner has not authorized
setup, and no real server-policy tests have been performed. The test workflow
explicitly uses `TURBO_CACHE=local:rw`: Turbo's filesystem cache is restored and
saved through GitHub Actions, not through Vercel. A cache miss or archive service
failure causes normal task execution; it does not skip validation.

Main seeds GitHub's default-branch cache. Same-repository PR saves are isolated by
GitHub's PR cache scope; forks only restore. None receives a Remote Cache token or
an OIDC permission from this implementation. Release does not restore the test
task cache or authenticate to Vercel; its existing npm publishing OIDC permission
is unchanged. Builds earlier in the release job may still be reused within it.
Coverage/Codecov remain full-scope. Selection and reuse are separate; see
[scheduling](scheduling.md) and the [acceptance matrix](README.md#integrated-acceptance-matrix).

## Task hash audit

The GitHub archive prefix and restore keys use `turbo-v3`; incompatible old
`turbo-v2` archives are not restored. Save limits/event scopes are unchanged.
Bump the schema when cache/output semantics or global hash inputs change.

An archive compatibility prefix does not protect a Turbo task fetched from a
remote service. `turbo.json` therefore hashes these inputs into **every** task:

| Inputs                                                | Why                                                                                                  |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm_config_user_agent`                               | With the pinned pnpm invocation, includes pnpm version, exact Node version, OS and CPU architecture. |
| `RUNNER_OS`, `RUNNER_ARCH`, `ImageOS`, `ImageVersion` | Separate hosted runner platform and image revisions, including changes to native tools.              |
| `CI`, `NODE_ENV`, `NODE_OPTIONS`                      | Separate CI behavior, production behavior and Node runtime flags.                                    |
| `LANG`, `LC_ALL`, `TZ`                                | Separate locale/timezone-sensitive output and tests.                                                 |

Use the existing `pnpm` commands: invoking Turbo without pnpm may omit its user
agent. This is not an automatic fingerprint of every possible machine; do not
enable shared remote reuse from arbitrary local machines or custom runners
without auditing their OS/native-tool environment too. Missing image variables
in local/release jobs do not match populated hosted-test image variables.

The source audit found no explicit environment reads in docs/build/test helpers;
runtime reads (`NODE_ENV` in react-utils and `npm_config_user_agent` in create-app)
are hashed. Consumer README examples are not build inputs. Strict environment
mode/framework inference are unchanged; `.env.*local` remains a global input.
Declare new environment-dependent inputs rather than hiding them in passthrough
variables. Never pass secrets to cache-producing tasks: logs are cached.
Artifact signing is not writer isolation.

Public `turbo run ... --dry=json` comparisons on Node 24.15.0, pnpm 11.3.0,
macOS arm64 verified every audited variable alters all 44 graph-node hashes,
including simulated image/timezone/Node flags and user-agent runtime/platform
changes. These are hash-invalidation checks, **not** cross-platform execution
or remote authorization proof.

Local full-graph execution passed 36 tasks, 367 tests and four uncached validators.
One fresh/warm local-cache smoke sample took 43.041/6.861 s (32 warm hits).
After moving outputs aside, all 1,853 recorded files, including 314 coverage
files, restored byte-for-byte with five complete report pairs. This is restoration
evidence, not a controlled timing comparison, remote transfer measurement or
runner speedup. Detailed local checks are in the
[#907 evidence archive](https://github.com/noaignite/accelerator/issues/907#issuecomment-7049279614).

## Owner setup gate (not provisioning instructions to run unattended)

The approved existing Vercel entitlement should be sufficient; no paid services,
personal tokens, credentials in issues, or automatic developer linking are
needed. Before changing any service or workflow, obtain explicit Owner approval
and authorized Actions test/publication access. The human-only setup stages are:

1. In the organization-owned team's **Settings → Build and Deployment**, confirm
   the team ID/slug, Owner authority and Remote Cache enablement. Record only
   public identifiers and an authorization/evidence reference.
2. Inspect **OIDC Policies for CLI Access → Turborepo CLI Policies**. Confirm actual
   claim matching and permission controls before creating a policy. The
   [first-party policy schema][policy] documents separate `read:remote-cache` and
   `read-write:remote-cache` permissions; documentation is not proof of this
   team's policy.
3. Authorize writes only for the exact conjunction below. Review **all** policies
   to ensure no broader policy can also exchange the same identity; selecting a
   policy ID in the client does not prevent malicious code selecting another.
4. Keep PRs credential-free unless their separate server policy proves read-only
   access **and** fork exclusion. GitHub's base `repository` claim, a client
   `remote:r` flag, or a workflow `if` is insufficient. Fork PRs can share base
   repository/PR identity claims; prove the head-repository distinction using
   actual available signed claims or do not enable PR federation.
5. Only after review/approval, implement the scoped integration and run the tests
   below. Confirm human setup stages with the Owner first; none is run here.

The intended writer policy must match issuer
`https://token.actions.githubusercontent.com`, the chosen exact audience,
`repository=noaignite/accelerator`, verified immutable repository/owner IDs,
`workflow_ref=noaignite/accelerator/.github/workflows/test.yml@refs/heads/main`,
`event_name=push`, and `ref=refs/heads/main`, with only
`read-write:remote-cache`. No claim wildcards or all-permission grants. Verify
claim availability and exact matching in the real integration; stop if any
required restriction cannot be enforced. Main-ref matching alone would also
admit release, which already has publishing OIDC permission.

The [first-party action][action] exchanges GitHub OIDC for short-lived,
team-associated, Remote-Cache-only credentials. Its `v1.0.0` tag resolved on
2026-11-20 to `135046f5efcadb17337d9b29b8d5b4035ae64b10`; audit and pin an
immutable revision when activation is approved. It is deliberately not installed
here. Do not add a stored `TURBO_TOKEN` secret as a shortcut.

## Required real-integration evidence before activation

Record redacted policy configuration and run URLs, not bearer tokens or raw JWTs:

- Main **test** push can exchange and write/read a harmless cache artifact.
- A PR reader can read but an actual artifact write is denied by the server,
  even with a write-enabled client. If unprovable, retain PR fallback.
- Fork identities, release, another workflow, wrong event/ref/audience and any
  broader matching policy cannot obtain the writer grant. Forks obtain no grant.
- Missing credentials, failed exchange and an unavailable remote service still
  execute required validation. Handle only authentication/service failures as
  cache fallback; do not retry or ignore ordinary task/coverage failures.
- Cold execution and warm remote restoration produce equivalent distribution
  artifacts and all five coverage producers' reports before Codecov upload.
  Compare allowed Node/platform/image combinations, proving incompatible hashes
  miss rather than restoring artifacts. Do not infer this from archive prefixes.
- Measure cold/warm push-to-green, queue/job time, selected tasks, cache hits,
  auth/transfer overhead and runner usage against comparable scheduling runs.

These policy/output/outage/timing tests remain **pending** Owner and
publication/test approval. No remote speedup is claimed; retain fallback.

## Optional developer use

Nothing links developer machines. Continue using existing full-scope local
commands and local caching. If organization-authorized remote access is desired
later, follow [Vercel's local setup documentation][local] and the team's approved
permissions; read-only client flags are not an access boundary. Audit local hash
compatibility first. Do not reuse CI credentials, print tokens, commit `.turbo`
link metadata, or automatically opt anyone in.

[policy]: https://registry.terraform.io/providers/vercel/vercel/latest/docs/resources/oidc_federation_policy
[action]: https://github.com/vercel/setup-turborepo-remote-cache-action
[local]: https://vercel.com/docs/monorepos/remote-caching
