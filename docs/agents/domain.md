# Domain docs

Use a single-context layout:

- `GLOSSARY.md` at the repository root for shared domain vocabulary.
- `docs/adr/` for architectural decisions.

Before exploring, read the glossary and ADRs relevant to the work.
If they do not exist, proceed silently. Create them lazily through
domain modeling when terms or decisions are resolved.

Use glossary terms in issue titles, proposals, hypotheses, and tests.
If a needed concept is missing, reconsider the terminology or flag the
gap for domain modeling.

Explicitly identify proposals that contradict an existing ADR, naming
the ADR and explaining why the decision should be reopened.
