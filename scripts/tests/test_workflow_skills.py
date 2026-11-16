"""CLI regressions for repo workflow skills; fixtures never touch real GitHub PRs."""

import json
import os
import re
from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
SCOPE = ROOT / ".agents/skills/changeset-pr/scripts/inspect_changeset_scope.py"
STATUS = ROOT / ".agents/skills/changeset-pr/scripts/run_changeset_status.py"
METADATA = ROOT / ".agents/skills/gh-pr-metadata/scripts/validate_pr_metadata.py"


class WorkflowSkillsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name).resolve()
        self.git("init", "-q")
        self.git("config", "user.email", "fixture@example.invalid")
        self.git("config", "user.name", "Fixture")
        self.write(".changeset/config.json", json.dumps({
            "baseBranch": "trunk", "fixed": [], "linked": [], "ignore": [],
        }))
        self.write("package.json", '{"name":"fixture","private":true}')
        self.write("pnpm-workspace.yaml", "packages:\n  - 'packages/*'\n")
        for name in ("alpha", "beta"):
            self.write(f"packages/{name}/package.json", json.dumps({"name": f"@fixture/{name}"}))
            self.write(f"packages/{name}/index.js", "export const value = 1;\n")
        self.commit()
        self.git("update-ref", "refs/remotes/origin/trunk", "HEAD")

    def git(self, *args):
        return subprocess.run(
            ["git", *args], cwd=self.repo, capture_output=True, text=True, check=True,
        ).stdout

    def write(self, path, text):
        target = self.repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text)
        return target

    def commit(self):
        self.git("add", ".")
        self.git("-c", "core.hooksPath=/dev/null", "commit", "-qm", "fixture")

    def cli(self, script, *args, expected=0, env=None):
        result = subprocess.run(
            ["python3", str(script), *args], cwd=self.repo,
            capture_output=True, text=True, env=env,
        )
        self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
        return result

    def scope(self, expected=0, *args):
        return json.loads(self.cli(SCOPE, "--json", *args, expected=expected).stdout)

    def test_runtime_change_requires_package_coverage(self):
        self.write("packages/alpha/index.js", "export const value = 2;\n")
        self.write(".changeset/runtime.md", "---\n'@fixture/alpha': patch\n---\n\nValue: Fix output.\n")
        self.commit()
        report = self.scope()
        self.assertEqual(report["base"], "origin/trunk")
        self.assertEqual(report["touched_publishable_packages"], ["@fixture/alpha"])
        self.assertEqual(report["missing_touched_publishable_packages"], [])

    def test_test_only_packages_allow_empty_changeset(self):
        for path in (
            "src/value.test.ts", "src/value.spec.ts", "test_value.py", "value_test.py",
            "test/helper.ts", "__tests__/helper.ts", "__snapshots__/value.snap",
        ):
            with self.subTest(path=path):
                self.write(f"packages/alpha/{path}", "test fixture\n")
        self.write(".changeset/tests.md", "---\n---\n\nTests: Cover values.\n")
        self.commit()
        report = self.scope()
        self.assertEqual(report["test_only_packages"], ["@fixture/alpha"])
        self.assertEqual(report["changesets"][0]["releases"], {})

    def test_mixed_changes_require_only_runtime_package(self):
        self.write("packages/alpha/value.test.js", "test fixture\n")
        self.write("packages/beta/index.js", "export const value = 2;\n")
        self.write(".changeset/mixed.md", "---\n'@fixture/beta': patch\n---\n\nValue: Fix output.\n")
        self.commit()
        self.assertEqual(self.scope()["test_only_packages"], ["@fixture/alpha"])
        self.write("packages/alpha/index.js", "export const value = 2;\n")
        self.commit()
        report = self.scope(1)
        self.assertEqual(report["missing_touched_publishable_packages"], ["@fixture/alpha"])

    def test_non_package_changes_need_branch_local_note(self):
        self.write("README.md", "Docs.\n")
        self.commit()
        self.assertIn("branch-local changeset", self.scope(1)["errors"][0])
        self.write(".changeset/docs.md", "---\n---\n\nDocs: Clarify usage.\n")
        self.commit()
        self.assertTrue(self.scope()["ok"])

    def test_base_notes_and_unpublished_work_do_not_cover_committed_changes(self):
        self.write(".changeset/inherited.md", "---\n'@fixture/alpha': patch\n---\n\nValue: Fix output.\n")
        self.commit()
        self.git("update-ref", "refs/remotes/origin/trunk", "HEAD")
        self.write("packages/alpha/index.js", "export const value = 2;\n")
        self.commit()
        self.write(".changeset/local.md", "---\n'@fixture/alpha': patch\n---\n\nValue: Fix output.\n")
        report = self.scope(1)
        self.assertEqual(report["changesets"], [])
        self.assertEqual(report["missing_touched_publishable_packages"], ["@fixture/alpha"])
        self.assertTrue(self.scope(0, "--include-working-tree")["ok"])

    def test_live_config_explicit_base_and_group_information(self):
        self.write("packages/alpha/index.js", "export const value = 2;\n")
        self.write(".changeset/runtime.md", "---\n'@fixture/alpha': patch\n---\n\nValue: Fix output.\n")
        self.write(".changeset/config.json", json.dumps({
            "baseBranch": "absent", "fixed": [["@fixture/alpha", "@fixture/beta"]],
            "linked": [], "ignore": ["@fixture/alpha"],
        }))
        self.commit()
        missing_base = self.cli(SCOPE, "--json", expected=128)
        self.assertIn("origin/absent", missing_base.stderr)
        report = self.scope(1, "--base", "origin/trunk")
        self.assertEqual(report["ignored_touched_packages"], ["@fixture/alpha"])
        self.assertTrue(any("private/ignored" in error for error in report["errors"]))
        self.write(".changeset/config.json", json.dumps({
            "baseBranch": "trunk", "fixed": [["@fixture/alpha", "@fixture/beta"]],
            "linked": [], "ignore": [],
        }))
        self.commit()
        self.assertEqual(self.scope()["fixed_groups_hit"], [["@fixture/alpha", "@fixture/beta"]])

    def test_empty_or_invalid_notes_fail(self):
        self.write("README.md", "Docs.\n")
        self.write(".changeset/docs.md", "---\n---\n\n<!-- TODO -->\n")
        self.commit()
        self.assertTrue(any("description is empty" in error for error in self.scope(1)["errors"]))
        self.write(".changeset/docs.md", "---\n'@fixture/alpha': urgent\n---\n\nInvalid.\n")
        self.commit()
        result = self.cli(SCOPE, "--json", expected=1)
        self.assertIn("Invalid release type", result.stderr)

    def test_working_tree_uses_net_diff_and_explicit_notes(self):
        self.write("packages/alpha/index.js", "export const value = 2;\n")
        self.commit()
        self.write("packages/alpha/index.js", "export const value = 1;\n")
        self.write("README.md", "Docs.\n")
        note = self.write(".changeset/local.md", "---\n---\n\nDocs: Clarify usage.\n")
        report = self.scope(0, "--include-working-tree", "--file", str(note))
        self.assertEqual(report["touched_packages"], [])
        self.assertEqual(report["changesets"][0]["releases"], {})

    def test_skill_relative_links_resolve_without_source_repository(self):
        for name in ("changeset-pr", "gh-pr-metadata"):
            folder = ROOT / ".agents/skills" / name
            for document in folder.rglob("*.md"):
                text = document.read_text()
                self.assertNotIn("rb-oxygen-dls", text)
                for link in re.findall(r"\]\((\.[^)]+)\)", text):
                    self.assertTrue((document.parent / link).exists(), f"{document}: {link}")

    def test_metadata_local_validation_and_draft_never_call_github(self):
        env, calls = self.fake_gh()
        self.cli(METADATA, "--title", "docs(agents): clarify checks",
                 "--body", "Docs-only: clarify checks. Validation: reviewed links.", env=env)
        result = self.cli(METADATA, "--print-template", env=env)
        self.assertIn("validation", result.stdout)
        self.assertFalse(calls.exists())
        self.cli(METADATA, "--title", "update pr", "--body", "Explanation.", expected=1, env=env)
        self.cli(METADATA, "--title", "fix: correct output",
                 "--body", "<!-- TODO -->", expected=1, env=env)
        self.cli(METADATA, "--title", "fix: correct output", expected=1, env=env)
        self.cli(METADATA, "--title", "fix: correct output", "--body", "Explanation.",
                 "--pr", "123", expected=1, env=env)
        body = self.write("body.md", "Docs-only: clarify checks. Validation: reviewed links.\n")
        self.cli(METADATA, "--title", "docs: clarify checks", "--body-file", str(body), env=env)
        self.assertFalse(calls.exists())

    def fake_gh(self):
        calls = self.repo / "gh-calls.json"
        stub = self.write("bin/gh", "#!/usr/bin/env python3\n"
                          "import json, pathlib, sys\n"
                          f"pathlib.Path({str(calls)!r}).write_text(json.dumps(sys.argv[1:]))\n"
                          "assert sys.argv[1:3] == ['pr', 'view'], 'Mutation forbidden'\n"
                          "print(json.dumps({'title':'fix: correct output','body':'Fix output; tested.'}))\n")
        stub.chmod(0o755)
        env = dict(os.environ, PATH=f"{stub.parent}{os.pathsep}{os.environ['PATH']}")
        return env, calls

    def test_metadata_reads_only_current_or_explicit_pr(self):
        env, calls = self.fake_gh()
        self.cli(METADATA, "--format", "json", env=env)
        self.assertEqual(json.loads(calls.read_text())[:3], ["pr", "view", "--json"])
        self.cli(METADATA, "--pr", "123", env=env)
        self.assertEqual(json.loads(calls.read_text())[:3], ["pr", "view", "123"])

    def test_status_wrapper_preserves_command_output_and_failure(self):
        self.write("node_modules/@changesets/cli/bin.js",
                   "console.log(JSON.stringify(process.argv.slice(2)));"
                   "console.error('fixture failure'); process.exitCode = 7;\n")
        output = self.repo / "status.json"
        result = self.cli(STATUS, "--json", "--verbose", "--output", str(output), expected=7)
        report = json.loads(result.stdout)
        self.assertEqual(report["exit_code"], 7)
        self.assertEqual(json.loads(report["stdout"]), ["status", "--verbose", "--output", str(output)])
        self.assertIn("fixture failure", report["stderr"])


if __name__ == "__main__":
    unittest.main()
