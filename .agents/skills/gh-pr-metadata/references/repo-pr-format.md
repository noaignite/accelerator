# PR Metadata Helper Reference

Policy: [Pull Request Conventions](../../../../AGENTS.md#pull-request-conventions).

## Inputs

- Without explicit input, the helper reads the current branch's PR using `gh pr view`.
- `--pr <number-or-url>` selects a different remote PR.
- `--title` and `--body` / `--body-file` validate a local draft together, without `--pr`.
- `--print-template` prints an optional drafting scaffold without reading a PR.

## Validation Limits

The helper checks conventional title syntax and rejects empty or comment-only bodies.
Accepted title types are `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`,
`refactor`, `revert`, and `test`.
It does not check whether claims match the diff or execution evidence, or impose
body sections. Review those claims manually using the linked policy.
The helper never writes GitHub metadata.

## Prerequisites

The helper requires Python 3. Remote reads additionally require an authenticated
`gh`; explicit local input and `--print-template` do not contact GitHub.
