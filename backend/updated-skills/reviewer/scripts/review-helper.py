#!/usr/bin/env python3
"""
Review Helper Utility for the /reviewer Skill.
Inspects git diffs, analyzes changed files, checks for anti-patterns,
debug statements, security keywords, and test parity.
Zero external dependencies (Python 3 standard library only).
"""

import argparse
import json
import os
import re
import subprocess
import sys

HIGH_RISK_PATTERNS = [
    r'auth', r'login', r'token', r'session', r'jwt', r'jwe',
    r'migration', r'schema\.prisma', r'upload', r'download',
    r'middleware', r'permission', r'role', r'crypto', r'secret'
]

HYGIENE_CHECKS = [
    (r'\bconsole\.(log|debug|info)\b', 'Debug console statement found'),
    (r'\bdebugger\b', 'Debugger breakpoint left in code'),
    (r'\bprint\(', 'Debug print statement found in Python code'),
    (r'\b(TODO|FIXME|HACK|XXX)\b', 'Unresolved developer marker found'),
    (r':\s*any\b|<any>|as\s+any\b', 'TypeScript "any" type bypass detected'),
    (r'(@ts-ignore|@ts-nocheck)', 'TypeScript compiler check suppression detected'),
    (r'eslint-disable', 'Linter suppression detected'),
    (r'Date\.now\(\)|Math\.random\(\)', 'Non-deterministic generator in test/code'),
    (r'(?<![.\w])(eval|exec)\(', 'Dynamic code execution (eval/exec) detected'),
    (r'shell\s*=\s*True', 'Subprocess execution with shell=True detected'),
]

SECRET_PATTERNS = [
    (r'(?i)(api[_-]?key|secret|password|passwd|private[_-]?key)\s*[:=]\s*["\'][A-Za-z0-9_\-]{8,}["\']', 'Potential hardcoded secret or token'),
    (r'-----BEGIN (RSA|EC|OPENSSH|PGP|PRIVATE) KEY-----', 'Hardcoded private key block detected')
]


def run_git(args, cwd=None):
    """Run a git command and return stdout string."""
    try:
        res = subprocess.run(
            ['git'] + args,
            cwd=cwd or os.getcwd(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False
        )
        return res.stdout.strip()
    except Exception as e:
        return ""


def determine_git_target(explicit_target=None, base_branch="main"):
    """Determine the optimal git diff target."""
    if explicit_target:
        return explicit_target

    # Check for uncommitted staged/unstaged changes
    status = run_git(['status', '--porcelain'])
    if status:
        return 'HEAD'

    # Check if we are on a feature branch compared to base
    current_branch = run_git(['rev-parse', '--abbrev-ref', 'HEAD'])
    if current_branch and current_branch not in ['main', 'master', 'HEAD']:
        # Check if base exists
        base_exists = run_git(['rev-parse', '--verify', base_branch])
        if base_exists:
            return f"{base_branch}...HEAD"

    # Default to last commit
    return 'HEAD~1'


IGNORED_PREFIXES = ('.claude/', '.github/skills/', '.opencode/')
CODE_EXTENSIONS = ('.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.go', '.java', '.kt', '.rb', '.cs')


def is_ignored(path):
    """Skip AI-assistant configuration (skills, agents): it is not application code."""
    return any(f'/{prefix}' in f'/{path}' for prefix in IGNORED_PREFIXES)


def get_untracked_files(target):
    """List new files not yet tracked by git (only when reviewing uncommitted changes).

    Paths are relative to the current folder, like the paths of `git diff --relative`.
    """
    if target != 'HEAD':
        return []
    output = run_git(['ls-files', '--others', '--exclude-standard'])
    return [path for path in output.splitlines() if path and not is_ignored(path)]


def get_diff_stats(target):
    """Retrieve diff stat summary, including untracked files."""
    stats = run_git(['diff', '--relative', '--stat', target, '--', '.', ':(exclude).claude'])
    untracked = get_untracked_files(target)
    if untracked:
        stats += f"\n {len(untracked)} untracked (new) file(s):\n" + "\n".join(f"   {p}" for p in untracked)
    return stats


def get_changed_files(target):
    """Retrieve list of modified files."""
    cmd = ['diff', '--relative', '--name-status', target]
    output = run_git(cmd)
    files = []
    for line in output.splitlines():
        parts = line.split('\t')
        if len(parts) >= 2:
            status = parts[0]
            path = parts[1]
            if not is_ignored(path):
                files.append({"status": status, "path": path})
    for path in get_untracked_files(target):
        files.append({"status": "??", "path": path})
    return files


def untracked_as_diff(target):
    """Render untracked files as added lines, so they are scanned like the rest of the diff."""
    chunks = []
    for path in get_untracked_files(target):
        try:
            with open(path, encoding='utf-8') as handle:
                lines = handle.read().splitlines()
        except (OSError, UnicodeDecodeError):
            continue
        chunks.append(f"+++ b/{path}")
        chunks.append(f"@@ -0,0 +1,{len(lines)} @@")
        chunks.extend('+' + line for line in lines)
    return "\n".join(chunks)


def scan_diff_content(target):
    """Scan git diff (and untracked files) for hygiene, security, and quality issues."""
    diff_output = run_git(['diff', '--relative', '-U0', target]) + "\n" + untracked_as_diff(target)
    current_file = None
    line_number = 0
    findings = []

    for line in diff_output.splitlines():
        if line.startswith('+++ b/'):
            current_file = line[6:]
            line_number = 0
            continue
        elif line.startswith('@@'):
            m = re.search(r'\+([0-9]+)', line)
            if m:
                line_number = int(m.group(1)) - 1
            continue
        elif not line.startswith('+') or line.startswith('+++'):
            continue

        line_number += 1
        added_text = line[1:]

        # Skip lockfiles, minified files, assistant configuration and non-code files (docs, JSON)
        if not current_file or is_ignored(current_file) or not current_file.endswith(CODE_EXTENSIONS):
            continue
        if any(skip in current_file for skip in ['.min.js', '.map']):
            continue

        # Check hygiene rules
        for pattern, desc in HYGIENE_CHECKS:
            if re.search(pattern, added_text):
                findings.append({
                    "file": current_file,
                    "line": line_number,
                    "type": "hygiene",
                    "description": desc,
                    "snippet": added_text.strip()[:80]
                })

        # Check secret patterns
        for pattern, desc in SECRET_PATTERNS:
            if re.search(pattern, added_text):
                findings.append({
                    "file": current_file,
                    "line": line_number,
                    "type": "security",
                    "description": desc,
                    "snippet": "[REDACTED]"
                })

    return findings


def analyze_test_parity(files):
    """Check if functional code changes are accompanied by test changes."""
    src_files = [f['path'] for f in files if not any(k in f['path'].lower() for k in ['test', 'spec', 'docs', 'readme', '.md', '.json', '.yml', '.yaml'])]
    test_files = [f['path'] for f in files if any(k in f['path'].lower() for k in ['test', 'spec', '__tests__'])]
    return {
        "source_files_count": len(src_files),
        "test_files_count": len(test_files),
        "has_tests": len(test_files) > 0,
        "src_files": src_files,
        "test_files": test_files
    }


def analyze_risk_profile(files):
    """Assess overall risk classification."""
    high_risk_files = []
    for f in files:
        path = f['path']
        if any(re.search(pat, path, re.IGNORECASE) for pat in HIGH_RISK_PATTERNS):
            high_risk_files.append(path)

    if high_risk_files:
        risk_level = "HIGH (🔴)"
    elif any(f['path'].endswith(('.ts', '.js', '.py', '.go', '.java')) for f in files):
        risk_level = "MEDIUM (🟡)"
    else:
        risk_level = "LOW (🟢)"

    return {
        "risk_level": risk_level,
        "high_risk_files": high_risk_files
    }


def main():
    parser = argparse.ArgumentParser(description="Code Review Helper CLI")
    parser.add_argument("target", nargs="?", default=None, help="Git target (e.g. HEAD, HEAD~1, main...HEAD, or path)")
    parser.add_argument("--base", default="main", help="Base branch for comparison (default: main)")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--summary", action="store_true", help="Output concise markdown summary")
    args = parser.parse_args()

    target = determine_git_target(args.target, args.base)
    files = get_changed_files(target)
    findings = scan_diff_content(target)
    test_parity = analyze_test_parity(files)
    risk = analyze_risk_profile(files)
    diff_stats = get_diff_stats(target)

    result = {
        "target": target,
        "files_count": len(files),
        "files": files,
        "diff_stats": diff_stats,
        "risk": risk,
        "test_parity": test_parity,
        "findings_count": len(findings),
        "findings": findings
    }

    if args.json:
        print(json.dumps(result, indent=2))
        return

    # Markdown output
    print(f"### 🔍 Code Review Pre-Scan Summary (`{target}`)\n")
    print(f"- **Risk Classification**: {risk['risk_level']}")
    print(f"- **Files Changed**: {len(files)}")
    print(f"- **Test Parity**: {'✅ Tests Included (' + str(test_parity['test_files_count']) + ')' if test_parity['has_tests'] else '⚠️ No test files touched in diff'}")

    if risk['high_risk_files']:
        print(f"- **High-Risk Modules**: `{', '.join(risk['high_risk_files'][:5])}`{' ...' if len(risk['high_risk_files']) > 5 else ''}")

    if findings:
        print(f"\n#### ⚠️ Automated Scanner Highlights ({len(findings)} detected):")
        for f in findings[:8]:
            print(f"- **{f['type'].upper()}** in `{f['file']}:{f['line']}`: {f['description']} (`{f['snippet']}`)")
        if len(findings) > 8:
            print(f"- *...and {len(findings) - 8} more findings.*")
    else:
        print("\n✅ Zero debug residue or dangerous tokens flagged by pre-scanner.")

    print(f"\n```text\n{diff_stats}\n```")


if __name__ == '__main__':
    main()
