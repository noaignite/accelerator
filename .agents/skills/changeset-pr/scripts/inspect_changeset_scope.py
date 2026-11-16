#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


VALID_RELEASE_TYPES = {"patch", "minor", "major"}
WORKSPACE_ROOTS = ("apps", "packages")


def run(cmd: list[str], cwd: Path) -> str:
    result = subprocess.run(
        cmd,
        cwd=str(cwd),
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def find_repo_root(start: Path) -> Path:
    return Path(run(["git", "rev-parse", "--show-toplevel"], start).strip()).resolve()


def load_changeset_config(repo_root: Path) -> dict:
    return json.loads((repo_root / ".changeset" / "config.json").read_text())


def package_manifests_at_ref(repo_root: Path, ref: str) -> list[str]:
    paths = run(
        ["git", "ls-tree", "-r", "--name-only", "-z", ref, "--", *WORKSPACE_ROOTS],
        repo_root,
    ).split("\0")
    return [path for path in paths if path.count("/") == 2 and path.endswith("/package.json")]


def discover_packages(
    repo_root: Path, base: str, include_working_tree: bool = False
) -> dict[str, dict]:
    repo_root = repo_root.resolve()
    packages: dict[str, dict] = {}
    if include_working_tree:
        workspaces = json.loads(
            run(["pnpm", "-r", "list", "--depth", "-1", "--json"], repo_root)
        )
        manifests = [
            str(Path(workspace["path"]).resolve().relative_to(repo_root) / "package.json")
            for workspace in workspaces
            if Path(workspace["path"]).resolve() != repo_root
        ]
    else:
        manifests = package_manifests_at_ref(repo_root, "HEAD")
    for path in manifests:
        data = json.loads(
            (repo_root / path).read_text()
            if include_working_tree
            else run(["git", "show", f"HEAD:{path}"], repo_root)
        )
        packages[data["name"]] = {
            "dir": str(Path(path).parent),
            "private": bool(data.get("private", False)),
            "base_dirs": [],
            "removed": False,
        }

    merge_base = run(["git", "merge-base", "HEAD", base], repo_root).strip()
    for path in package_manifests_at_ref(repo_root, merge_base):
        data = json.loads(run(["git", "show", f"{merge_base}:{path}"], repo_root))
        name = data["name"]
        old_dir = str(Path(path).parent)
        if name in packages:
            packages[name]["base_dirs"].append(old_dir)
        else:
            packages[name] = {
                "dir": old_dir,
                "private": bool(data.get("private", False)),
                "base_dirs": [old_dir],
                "removed": True,
            }
    return packages


def changed_files(repo_root: Path, base: str, include_working_tree: bool = False) -> list[str]:
    merge_base = run(["git", "merge-base", "HEAD", base], repo_root).strip()
    cmd = ["git", "diff", "--name-only", "--no-renames", "-z", merge_base]
    if not include_working_tree:
        cmd.append("HEAD")
    files = run(cmd, repo_root).split("\0")
    if include_working_tree:
        files += run(
            ["git", "ls-files", "--others", "--exclude-standard", "-z"], repo_root
        ).split("\0")
    return sorted({path for path in files if path})


def package_for_file(path_str: str, packages: dict[str, dict]) -> str | None:
    best_name = None
    best_len = -1
    for name, meta in packages.items():
        for pkg_dir in [meta["dir"], *meta.get("base_dirs", [])]:
            pkg_dir = pkg_dir.rstrip("/")
            if path_str == pkg_dir or path_str.startswith(f"{pkg_dir}/"):
                if len(pkg_dir) > best_len:
                    best_len = len(pkg_dir)
                    best_name = name
    return best_name


def is_publishable(meta: dict, name: str, ignored: set[str]) -> bool:
    return not meta["private"] and not meta["removed"] and name not in ignored


def is_test_file(path_str: str) -> bool:
    path = Path(path_str)
    return bool(
        re.search(r"\.(test|spec)\.", path.name)
        or (path.suffix == ".py" and (path.name.startswith("test_") or path.stem.endswith("_test")))
        or {"test", "__tests__", "__snapshots__"}.intersection(path.parts[:-1])
    )


def parse_changeset_file(path: Path, text: str | None = None) -> dict:
    text = (path.read_text() if text is None else text).strip()
    lines = text.splitlines()
    if len(lines) < 3 or lines[0].strip() != "---":
        raise ValueError("Changeset file must start with frontmatter delimited by ---")
    end_index = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_index = i
            break
    if end_index is None:
        raise ValueError("Changeset file frontmatter is missing the closing ---")

    releases: dict[str, str] = {}
    for raw in lines[1:end_index]:
        line = raw.strip()
        if not line:
            continue
        if ":" not in line:
            raise ValueError(f"Invalid frontmatter line: {raw}")
        pkg, release_type = line.split(":", 1)
        pkg = pkg.strip().strip("\"'")
        release_type = release_type.strip().strip("\"'")
        if not pkg or release_type not in VALID_RELEASE_TYPES:
            raise ValueError(f"Invalid release type or package: {raw}")
        if pkg in releases:
            raise ValueError(f"Duplicate package in frontmatter: {pkg}")
        releases[pkg] = release_type

    summary = "\n".join(lines[end_index + 1 :]).strip()
    return {"releases": releases, "summary": summary}


def build_report(
    repo_root: Path,
    base: str,
    file_paths: list[Path] | None = None,
    include_working_tree: bool = False,
) -> dict:
    repo_root = repo_root.resolve()
    config = load_changeset_config(repo_root)
    packages = discover_packages(repo_root, base, include_working_tree)
    ignored = set(config.get("ignore", []))
    fixed_groups = [set(group) for group in config.get("fixed", [])]
    files = changed_files(repo_root, base, include_working_tree)
    touched_packages = sorted(
        {pkg for path in files for pkg in [package_for_file(path, packages)] if pkg}
        | {
            name
            for name, meta in packages.items()
            if meta["removed"]
            and any(package_for_file(path, {name: meta}) for path in files)
        }
    )
    touched_publishable = [
        pkg for pkg in touched_packages if is_publishable(packages[pkg], pkg, ignored)
    ]
    packages_under_packages_root = {
        pkg
        for path in files
        if path.startswith("packages/")
        for pkg in [package_for_file(path, packages)]
        if pkg
    }
    required_packages = sorted(packages_under_packages_root.intersection(touched_publishable))
    non_test_packages = {
        pkg
        for path in files
        if not is_test_file(path)
        for pkg in [package_for_file(path, packages)]
        if pkg
    }
    test_only_packages = sorted(set(touched_packages) - non_test_packages)
    required_packages = sorted(set(required_packages) - set(test_only_packages))
    errors: list[str] = []
    warnings: list[str] = []
    for pkg in touched_packages:
        meta = packages[pkg]
        if meta["removed"]:
            warnings.append(f"Removed or renamed package {pkg}: review release identity")
        elif any(directory != meta["dir"] for directory in meta["base_dirs"]):
            warnings.append(
                f"Moved package {pkg}: {meta['base_dirs']} -> {meta['dir']}; review release identity"
            )
        if (
            pkg in packages_under_packages_root
            and pkg in non_test_packages
            and not meta["removed"]
            and not is_publishable(meta, pkg, ignored)
        ):
            errors.append(f"{pkg}: /packages policy conflicts with private/ignored configuration")

    if file_paths is None:
        head_files = set(
            run(
                ["git", "ls-tree", "-r", "--name-only", "-z", "HEAD", "--", ".changeset"],
                repo_root,
            ).split("\0")
        )
        file_paths = [
            repo_root / path
            for path in files
            if Path(path).parent == Path(".changeset")
            and path.endswith(".md")
            and path != ".changeset/README.md"
            and ((repo_root / path).is_file() if include_working_tree else path in head_files)
        ]
        read_local = include_working_tree
    else:
        read_local = True
    covered: set[str] = set()
    changesets = []
    for file_path in file_paths:
        relative_path = file_path.resolve().relative_to(repo_root)
        if (
            relative_path.parent != Path(".changeset")
            or relative_path.suffix != ".md"
            or relative_path.name == "README.md"
        ):
            raise ValueError(f"Expected a .changeset release note: {relative_path}")
        text = None if read_local else run(["git", "show", f"HEAD:{relative_path}"], repo_root)
        parsed = parse_changeset_file(file_path, text)
        listed = sorted(parsed["releases"])
        unknown = [pkg for pkg in listed if pkg not in packages or packages[pkg]["removed"]]
        excluded = [
            pkg
            for pkg in listed
            if pkg in packages
            and not packages[pkg]["removed"]
            and not is_publishable(packages[pkg], pkg, ignored)
        ]
        summary_present = bool(re.sub(r"<!--[\s\S]*?-->", "", parsed["summary"]).strip())
        if not summary_present:
            errors.append(f"{relative_path}: description is empty")
        errors += [f"{relative_path}: unknown or removed package {pkg}" for pkg in unknown]
        errors += [f"{relative_path}: private or ignored package {pkg}" for pkg in excluded]
        covered.update(set(listed) - set(unknown) - set(excluded))
        extra = [
            pkg for pkg in listed if pkg not in touched_publishable or pkg in test_only_packages
        ]
        warnings += [
            f"{relative_path}: {pkg} has no non-test changes; review indirect scope"
            for pkg in extra
            if pkg not in unknown and pkg not in excluded
        ]
        changesets.append({
            "path": str(relative_path),
            "releases": parsed["releases"],
            "summary_present": summary_present,
        })
    if not changesets:
        errors.append(
            "Every PR requires a branch-local changeset, including non-package and test-only changes"
        )
    missing = sorted(set(required_packages) - covered)
    errors += [f"Missing changeset coverage for {pkg}" for pkg in missing]

    return {
        "base": base,
        "include_working_tree": include_working_tree,
        "changed_files_count": len(files),
        "touched_packages": touched_packages,
        "touched_publishable_packages": touched_publishable,
        "test_only_packages": test_only_packages,
        "private_touched_packages": [pkg for pkg in touched_packages if packages[pkg]["private"]],
        "ignored_touched_packages": [pkg for pkg in touched_packages if pkg in ignored],
        "fixed_groups_hit": [
            sorted(group) for group in fixed_groups if group.intersection(touched_publishable)
        ],
        "changesets": changesets,
        "missing_touched_publishable_packages": missing,
        "warnings": warnings,
        "errors": errors,
        "ok": not errors,
    }


def print_text(report: dict) -> None:
    print(f"Base: {report['base']}")
    print(f"Working tree included: {report['include_working_tree']}")
    print(f"Changed files: {report['changed_files_count']}")

    def print_list(label: str, values: list[str]) -> None:
        print(f"{label}:")
        if not values:
            print("- none")
            return
        for value in values:
            print(f"- {value}")

    print_list("Touched packages", report["touched_packages"])
    print_list("Touched publishable packages", report["touched_publishable_packages"])
    print_list("Test-only packages (no release required)", report["test_only_packages"])
    print_list("Private touched packages", report["private_touched_packages"])
    print_list("Ignored touched packages", report["ignored_touched_packages"])
    print_list("Fixed groups hit", [", ".join(group) for group in report["fixed_groups_hit"]])
    for changeset in report["changesets"]:
        print(f"Changeset file: {changeset['path']}")
        print(f"Listed releases: {json.dumps(changeset['releases'])}")
        print(f"Summary present: {'yes' if changeset['summary_present'] else 'no'}")
    print_list("Warnings", report["warnings"])
    print_list("Errors", report["errors"])


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Inspect changed packages on the branch and validate changesets against repo config."
    )
    parser.add_argument(
        "--base", help="Branch or ref to diff against; defaults to the configured base branch"
    )
    parser.add_argument(
        "--file", action="append",
        help="Optional .changeset/*.md file to validate; repeat for aggregate coverage",
    )
    parser.add_argument(
        "--include-working-tree", action="store_true",
        help="Include the net local diff and untracked files",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    args = parser.parse_args()

    try:
        repo_root = find_repo_root(Path.cwd())
        base = args.base or f"origin/{load_changeset_config(repo_root)['baseBranch']}"
        file_paths = [Path(path).resolve() for path in args.file] if args.file else None
        report = build_report(repo_root, base, file_paths, args.include_working_tree)
    except subprocess.CalledProcessError as exc:
        sys.stderr.write(exc.stderr or str(exc))
        return exc.returncode
    except Exception as exc:
        sys.stderr.write(f"{exc}\n")
        return 1

    if args.json:
        print(json.dumps(report, indent=2, sort_keys=True))
    else:
        print_text(report)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
