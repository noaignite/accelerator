# Issue tracker: GitHub

Issues and specs live in `noaignite/accelerator` GitHub Issues.
Use the `gh` CLI. Publishing to the issue tracker means creating an issue.

## Issue operations

- Verify the target with `gh repo view --json nameWithOwner`.
- Create: `gh issue create --repo noaignite/accelerator --title "..." --body-file <file>`.
- Read: `gh issue view <number> --json number,title,body,labels,comments`.
- List: `gh issue list --state open --json number,title,body,labels`.
- Comment: `gh issue comment <number> --body-file <file>`.
- Label: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- Close: post the explanation as a comment, then `gh issue close <number>`.
- Represent parent-child relationships with native sub-issues when supported;
  otherwise put `Part of #<parent>` in the child and link it from the parent.
- Represent blockers with native issue dependencies when supported;
  otherwise put `Blocked by: #<number>` at the top of the issue body.
  Work is unblocked when all blockers are closed.

## Project board

Use Accelerator Project #8:
https://github.com/orgs/noaignite/projects/8

Issues remain the source of truth for requirements, discussion, dependencies,
and triage labels. The project provides the delivery kanban view.

Add newly created work issues to the board:
`gh project item-add 8 --owner noaignite --url <issue-url>`.

Use its existing Status options:

- Todo: work has not started.
- In Progress: implementation is underway.
- Review: work is awaiting review.
- Done: work is complete.

Triage labels describe readiness; project status describes delivery progress.
Changing one does not automatically imply a change to the other.
Preserve existing project workflows and automation.

Project reads require `read:project`; writes require `project`.
If access is missing, report it and continue with issue operations that work.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Wayfinding

Use one issue labelled `wayfinder:map` for the map, with child issues for
tickets. Label children `wayfinder:<type>` (research, prototype, grilling,
or task). Use the dependency conventions above.

The next ticket is the first open child in map order with no open blockers
and no assignee. Claim it with `gh issue edit <number> --add-assignee @me`.
Resolve it with an answer comment and closure, then add a summary and link
to the map's Decisions-so-far.
