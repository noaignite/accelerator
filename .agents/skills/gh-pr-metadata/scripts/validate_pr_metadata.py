#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


TITLE_RE = (
    r"^(build|chore|ci|docs|feat|fix|perf|refactor|revert|test)"
    r"(\([^()\r\n]+\))?!?: \S[^\r\n]*"
)

DEFAULT_TEMPLATE = """<!-- Describe what changed and why it was needed. -->

<!-- Explain user or runtime impact; identify docs-only work explicitly. -->

<!-- Report actual validation commands/results and failed or skipped checks with causes. -->
"""


def run(cmd: list[str], cwd: Path) -> str:
    proc = subprocess.run(
        cmd,
        cwd=str(cwd),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or proc.stdout.strip())
    return proc.stdout


def read_current_pr(cwd: Path, target: str | None = None) -> tuple[str, str]:
    raw = run(
        [
            "gh", "pr", "view", *([target] if target else []),
            "--json", "title,body", "--jq", "{title: .title, body: .body}",
        ],
        cwd,
    )
    data = json.loads(raw)
    if not isinstance(data.get("title"), str) or (
        data.get("body") is not None and not isinstance(data["body"], str)
    ):
        raise ValueError("GitHub returned invalid title/body metadata")
    return data["title"], data.get("body") or ""


def load_body(args: argparse.Namespace, cwd: Path) -> tuple[str, str]:
    if args.title is not None or args.body is not None or args.body_file is not None:
        if args.title is None or (args.body is None and args.body_file is None) or args.pr:
            raise ValueError("Provide --title and --body/--body-file together, without --pr")
        if args.body_file is not None:
            body = Path(args.body_file).read_text()
        else:
            body = args.body
        return args.title, body
    return read_current_pr(cwd, args.pr)


def validate_title(title: str) -> list[str]:
    errors: list[str] = []
    if not title:
        errors.append("title is empty")
        return errors
    if not re.fullmatch(TITLE_RE, title):
        errors.append(
            "title does not match conventional format "
            "(expected `type(scope): summary` or `type: summary`)"
        )
    if title.startswith("["):
        errors.append("title should not start with a bracketed prefix")
    return errors


def validate_body(body: str) -> list[str]:
    if not re.sub(r"<!--[\s\S]*?-->", "", body).strip():
        return ["body is empty or contains only comments"]
    return []


def print_template() -> None:
    sys.stdout.write(DEFAULT_TEMPLATE)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate PR title syntax and a non-empty body; review content against AGENTS.md."
    )
    parser.add_argument("--title", help="Explicit PR title to validate.")
    body_group = parser.add_mutually_exclusive_group()
    body_group.add_argument("--body", help="Explicit PR body to validate.")
    body_group.add_argument("--body-file", help="Path to a PR body file to validate.")
    parser.add_argument("--pr", help="Explicit PR number or URL; defaults to the current branch.")
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repo root. Defaults to current working directory.",
    )
    parser.add_argument(
        "--print-template",
        action="store_true",
        help="Print an optional PR body drafting scaffold and exit.",
    )
    parser.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        help="Output format.",
    )
    args = parser.parse_args()

    cwd = Path(args.repo_root).resolve()
    if args.print_template:
        print_template()
        return 0

    title, body = load_body(args, cwd)
    errors = validate_title(title) + validate_body(body)
    payload = {
        "ok": not errors,
        "title": title,
        "errors": errors,
    }

    if args.format == "json":
        sys.stdout.write(json.dumps(payload, indent=2) + "\n")
    else:
        if errors:
            sys.stdout.write("PR metadata validation failed:\n")
            for error in errors:
                sys.stdout.write(f"- {error}\n")
        else:
            sys.stdout.write("PR metadata validation passed.\n")

    return 0 if not errors else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, ValueError) as exc:
        sys.stderr.write(f"{exc}\n")
        raise SystemExit(1)
