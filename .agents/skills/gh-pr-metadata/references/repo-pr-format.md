# Repo PR Format

Source: the root `AGENTS.md` Pull Request Conventions.

## PR Body Guidance

Keep the body prose-first and explain:

- what changed
- why the change was needed
- user or runtime impact
- validation that was run
- any failed or skipped checks, with cause

If a PR is docs-only, say that explicitly and keep the body brief. Preserve useful issue links and reviewer context. The repository does not require particular headings or checklist items.

## Title Convention

Prefer conventional-commit style:

```text
type(scope): short summary
```

Examples:

- `fix(react-utils): correct element size calculation`
- `feat(style-guide): add lint rule defaults`
- `docs(agents): clarify workspace checks`

Avoid vague summaries such as `update pr`, or titles that do not describe the branch's actual change.

## Authorization

Validation and drafting are read-only. The helper only reads PR metadata or explicit local input; it never edits GitHub. Preserve useful issue links and reviewer context when an update is authorized, and re-read metadata before applying it to reconcile concurrent edits.

The helper requires Python 3. Remote reads additionally require an authenticated
`gh`; explicit local input and `--print-template` do not contact GitHub.
