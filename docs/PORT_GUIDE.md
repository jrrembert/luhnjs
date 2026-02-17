# Port Guide

> A self-contained blueprint for porting luhnjs to any programming language using Claude Code.

## 1. Overview

This document captures everything needed to recreate the luhnjs project in another language. It is designed to be used as a prompt for Claude Code in a new, empty repository.

**How to use this guide:**

1. Create a new repository for the target language
2. Provide this document (and [`SPEC.md`](SPEC.md)) to Claude Code
3. Follow the [porting checklist](#9-porting-checklist) to implement the library

The algorithm specification, full API surface, test vectors, and input validation rules live in [`SPEC.md`](SPEC.md). This guide covers everything else: project structure, documentation, CI/CD, and adaptation guidance.

## 2. Project Structure

Adapt this layout to the target language's conventions:

```
<project-root>/
  src/                        # Source code
    luhn.<ext>                 # All algorithm implementations
    luhn.test.<ext>            # Co-located tests
  docs/
    SPEC.md                   # Copy from luhnjs (language-agnostic specification)
    RELEASE.md                # Release process documentation
    CI.md                     # CI/CD documentation
    PORT_GUIDE.md             # This file (optional — include for further ports)
  .github/
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    workflows/
      ci.<yml>                # Lint, build, test
      release.<yml>           # Semantic-release
      pr-title.<yml>          # PR title validation
      update-copyright-date.<yml>
    PULL_REQUEST_TEMPLATE.md
  CLAUDE.md                   # Claude Code instructions
  CONTRIBUTING.md
  SECURITY.md
  CODE_OF_CONDUCT.md
  LICENSE
  README.md
  update-copyright-date.sh    # Copyright year updater script
```

### Public API entry point

The library must export exactly 6 public functions:

- `generate(value, options?)` — Luhn check digit generation
- `validate(value)` — Luhn checksum validation
- `random(length)` — Random number generation with valid checksum
- `generateModN(value, n, options?)` — Mod-N check character generation
- `validateModN(value, n)` — Mod-N validation
- `checksumModN(value, n)` — Mod-N checksum calculation

See [`SPEC.md`](SPEC.md) for complete signatures, behavior, and constraints.

## 3. Documentation Templates

### README.md

```markdown
# <project-name>

[![CI](badge-url)](ci-url)
[![codecov](badge-url)](codecov-url)

A <Language> implementation of the Luhn algorithm for generating and validating checksums.

Published as [`<package-name>`](<registry-url>) on <registry>.

## Getting Started

### Prerequisites

<Language runtime and package manager prerequisites>

### Installation

```<shell>
<install command>
```

### Usage

```<language>
// Generate a checksum
generate("7992739871")               // "79927398713"
generate("7992739871", checkSumOnly) // "3"

// Validate a checksum
validate("79927398713")              // true

// Generate a random number with valid checksum
random("16")                         // e.g. "4539148803436467"

// Mod-N variants (base 2-36, supports alphanumeric)
generateModN("1", 16)                // "1E"
validateModN("1E", 16)               // true
checksumModN("12345", 10)            // 5
```

## Commands

```<shell>
<dependency install command>
<lint command>
<test command>
<build command>
```

## Documentation

- [Specification](docs/SPEC.md) - API specification
- [Release Process](docs/RELEASE.md) - Automated releases via semantic-release
- [CI/CD](docs/CI.md) - Workflows and troubleshooting
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Security](SECURITY.md) - Reporting vulnerabilities

## Contact

Email: [J. Ryan Rembert](mailto:j.ryan.rembert@gmail.com)

## License

[MIT](LICENSE)

Copyright © <start-year>-<current-year> J. Ryan Rembert
```

### CONTRIBUTING.md

```markdown
# Contributing

Thanks for your interest in contributing to <project-name>! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Getting Started

```<shell>
git clone <repo-url>
cd <project-name>
<install command>
```

## Development

```<shell>
<lint command>
<test command>
<build command>
```

## Workflow

1. Open a GitHub issue describing the change
2. Create a branch from `rc` (for `feat:`/`fix:` changes) or `main` (for `docs:`/`chore:` changes)
   - Branch naming: `feature/`, `fix/`, `chore/`, `docs/` prefixes
3. Write a failing test, then implement the fix or feature (TDD)
4. Ensure lint, test, and build all pass
5. Commit using [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.)
6. Open a pull request with `Closes #N` in the description

## Code Style

<Language-specific linter> enforces the project's style. Run `<lint command>` to check. Key rules: <list key style rules>.
```

### SECURITY.md

```markdown
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately by emailing **j.ryan.rembert@gmail.com**.

Please do **not** open a public GitHub issue for security vulnerabilities.

## What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact

## Response

You can expect an initial response within 72 hours. Once confirmed, a fix will be prioritized and released as a patch.
```

### CODE_OF_CONDUCT.md

```markdown
# Code of Conduct

This project follows the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

Please read the full text at the link above. In summary, we are committed to providing a welcoming and inclusive environment for everyone.

## Enforcement

Instances of unacceptable behavior may be reported to **j.ryan.rembert@gmail.com**. All complaints will be reviewed and investigated promptly and fairly.
```

### LICENSE

```
MIT License

Copyright (c) <start-year>-<current-year> J. Ryan Rembert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 4. GitHub Templates

### `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Summary

<!-- Brief description of what this PR does and why -->

Closes #

## Changes

<!-- Bulleted list of key changes -->

-

## Test plan

<!-- How were these changes tested? -->

- [ ] Lint passes
- [ ] Tests pass
- [ ] Build passes
```

### `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug report
about: Report a bug
labels: bug
---

## Description

<!-- What happened? -->

## Steps to reproduce

1.

## Expected behavior

<!-- What should have happened? -->

## Environment

- <Language> version:
- Package version:
```

### `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: Feature request
about: Suggest a new feature
labels: enhancement
---

## Description

<!-- What would you like to see added? -->

## Use case

<!-- Why is this needed? What problem does it solve? -->
```

## 5. CI/CD Patterns

### CI workflow (lint, build, test)

Every push and pull request should trigger:

1. **Checkout** the repository
2. **Set up** the language runtime
3. **Install** dependencies (with lockfile)
4. **Lint** the code
5. **Build** the project
6. **Test** with coverage

### Release workflow (semantic-release)

Triggered on push to `main` and `rc` branches:

1. Checkout with full history (`fetch-depth: 0`)
2. Set up language runtime
3. Install dependencies
4. Lint
5. Build
6. Test
7. Run semantic-release

**Semantic-release configuration** (`.releaserc.json`):

```json
{
  "branches": [
    "main",
    {
      "name": "rc",
      "prerelease": "rc"
    }
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "<language-specific-publish-plugin>",
    "@semantic-release/github"
  ]
}
```

Required secrets: `GITHUB_TOKEN`, plus a registry-specific token (e.g., `NPM_TOKEN`, `PYPI_TOKEN`, `CRATES_TOKEN`).

### PR title validation workflow

Validates PR titles match conventional commit format:

```yaml
name: PR Title Validation

on:
  pull_request_target:
    types: [opened, edited, synchronize]

jobs:
  validate-pr-title:
    name: Validate PR title
    runs-on: ubuntu-latest
    permissions:
      pull-requests: read
    steps:
      - uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            feat
            fix
            chore
            docs
            refactor
            test
```

## 6. Release & Git Conventions

### Conventional commits

All commits, PR titles, and issue titles follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose | Triggers release? |
|---|---|---|
| `feat:` | New feature | Yes (minor) |
| `fix:` | Bug fix | Yes (patch) |
| `chore:` | Maintenance | No |
| `docs:` | Documentation | No |
| `refactor:` | Code restructuring | No |
| `test:` | Test changes | No |

### Branch strategy

- `main` — stable releases (protected, no direct pushes)
- `rc` — release candidates (protected, no direct pushes)
- `feature/<name>` — new features, branch from `rc`
- `fix/<name>` — bug fixes, branch from `rc`
- `chore/<name>` — maintenance, may branch from `main`
- `docs/<name>` — documentation, may branch from `main`

### Release flow

1. Push `feat:` or `fix:` commits to `rc` → publishes pre-release (e.g., `1.0.0-rc.1`)
2. Merge `rc` into `main` via PR → publishes stable release (e.g., `1.0.0`)
3. Every stable release must be preceded by at least one release candidate

### Branch protection rules

Both `main` and `rc` branches should have:

- Require pull request before merging
- No force pushes
- No direct pushes (all changes via PR)

### PR workflow

- Default PR target is `rc` for `feat:` and `fix:` changes
- `chore:`, `docs:`, `refactor:`, `test:` changes may target `main` directly
- Every PR body must include `Closes #N` to link to its issue
- Always merge via GitHub UI or CLI (`gh pr merge`) — never merge locally

## 7. Copyright & License

### Copyright update script (`update-copyright-date.sh`)

```bash
#!/bin/bash

# Check if at least one file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <file1> [file2] ..."
    exit 1
fi

current_year=$(date +"%Y")

for file in "$@"; do
  # Check if file exists
  if [ ! -f "$file" ]; then
      echo "Error: File $file not found"
      exit 1
  fi

  # Update "© YYYY" or "© YYYY-YYYY" patterns (README.md)
  sed -i.bak -E "s/(© )([0-9]{4})([-][0-9]{4})?/\1\2-$current_year/" "$file"

  # Update "(c) YYYY" or "(c) YYYY-YYYY" patterns (LICENSE)
  sed -i.bak -E "s/(\(c\) )([0-9]{4})([-][0-9]{4})?/\1\2-$current_year/" "$file"

  # Remove backup file
  rm "${file}.bak"

  echo "Copyright years updated in $file"
done
```

### Copyright update workflow (`.github/workflows/update-copyright-date.yml`)

```yaml
name: update copyright date

on:
  schedule:
    # At the beginning of every year.
    - cron: "0 0 1 1 *"

jobs:
  update-copyright:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4
      - name: Update copyright years
        run: ./update-copyright-date.sh README.md LICENSE
      - name: Create pull request
        uses: peter-evans/create-pull-request@v7
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "chore: update copyright year"
          branch: chore/update-copyright-${{ github.run_id }}
          title: "chore: update copyright year"
          body: "Automated annual copyright year update for README.md and LICENSE."
          labels: dependencies
```

## 8. CLAUDE.md Template

Each port should include a `CLAUDE.md` for Claude Code with language-specific commands and the shared git workflow:

```markdown
# CLAUDE.md

## Overview

<Language> library implementing the Luhn algorithm for generating and validating checksums. Published as `<package-name>` on <registry>.

## Commands

```<shell>
<install>        # Install dependencies
<build>          # Compile/build
<test>           # Run all tests
<test-single>    # Run a single test file
<test-pattern>   # Run tests matching a pattern
<lint>           # Lint
```

## Releases

Releases are fully automated via [semantic-release](https://github.com/semantic-release/semantic-release). No manual versioning or publishing is needed. See `docs/RELEASE.md` for details.

- **Release candidates**: Push `feat:`/`fix:` commits to the `rc` branch → publishes pre-release versions (e.g., `1.0.0-rc.1`)
- **Stable releases**: Merge `rc` into `main` → publishes stable versions (e.g., `1.0.0`)
- Every stable release must be preceded by at least one release candidate

## Architecture

- Entry point re-exporting the public API: `generate`, `validate`, `random`, `generateModN`, `validateModN`, `checksumModN`
- All algorithm implementations in a single source file
- Co-located tests

## Git Workflow

- **Default PR target is `rc`** — all `feat:` and `fix:` branches target `rc`, not `main`
- `chore:`, `docs:`, `refactor:`, `test:` branches may target `main` directly (they don't trigger releases)
- To publish a stable release, merge `rc` → `main` via PR
- Never push directly to `main` or `rc`
- Never force push to protected branches (`main`, `rc`) without explicit approval from the repo admin
- Every change must have a GitHub issue. If the user provides an issue number, use it. Otherwise, create one before starting work
- Every PR must include `Closes #N` in the body to auto-close its issue on merge
- **Note**: `Closes #N` only auto-closes when merging into the default branch (`main`). PRs targeting `rc` won't auto-close issues — include `Closes #N` in the release PR (`rc` → `main`) or close manually
- Branch naming: use prefixes `feature/`, `fix/`, `chore/` (e.g., `feature/add-auth`, `fix/login-bug`)
- Commits, PR titles, and issue titles follow conventional commit format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Always merge PRs via GitHub UI or `gh pr merge` — never merge locally with `git merge` then push
- PRs use the template at `.github/PULL_REQUEST_TEMPLATE.md` — fill in all sections (Summary, Changes, Test plan)

This project follows Test-Driven Development (TDD). For every feature or bug fix:

1. **Red**: Write a failing test first that defines the expected behavior
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Clean up the code while keeping tests green

## Code Style

<Language-specific linting and style rules>
```

## 9. Porting Checklist

Follow this order when implementing a new port:

- [ ] **1. Project setup** — Initialize with the language's package manager, set up linting, configure build tooling
- [ ] **2. Core Luhn algorithm** — Implement `generate` with TDD (write failing tests from SPEC.md test vectors first, then implement)
- [ ] **3. Validation** — Implement `validate` with TDD (uses `generate` internally)
- [ ] **4. Input validation** — Implement the shared validation routine with exact error messages from SPEC.md section 4
- [ ] **5. Random generation** — Implement `random` with TDD (uses `generate` internally)
- [ ] **6. Mod-N variant** — Implement `generateModN`, `validateModN`, `checksumModN` with TDD
- [ ] **7. Verify all test vectors** — Run all 106 test cases from SPEC.md section 5; every one must pass
- [ ] **8. Documentation** — Create README.md, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, LICENSE using templates above
- [ ] **9. GitHub templates** — Create issue templates and PR template
- [ ] **10. CI/CD** — Set up CI workflow (lint, build, test), release workflow (semantic-release), PR title validation
- [ ] **11. CLAUDE.md** — Create Claude Code instructions using the template above
- [ ] **12. Copyright automation** — Add `update-copyright-date.sh` and its workflow
- [ ] **13. Branch protection** — Configure `main` and `rc` branch protection rules

## 10. Language-Specific Adaptation Notes

### What must be preserved exactly

- **Error messages** — Must match SPEC.md exactly (e.g., `"string cannot be empty"`, `"value must be a string - received null"`)
- **Test vectors** — All inputs and expected outputs from SPEC.md section 5
- **API behavior** — Return types, validation order, edge cases (leading zeros, check digit ranges)
- **`CODE_POINTS` alphabet** — `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ` (36 characters, used by mod-N functions)
- **Function count** — Exactly 6 public functions

### What should follow language conventions

- **Function names** — Use the language's naming convention (e.g., `generate_mod_n` in Python/Rust, `GenerateModN` in Go, `generate-mod-n` in Clojure)
- **Options/configuration** — Use the language's idiomatic pattern (e.g., keyword arguments in Python, options struct in Go, builder pattern in Rust)
- **Error handling** — Use the language's standard error mechanism (exceptions, Result types, error returns), but preserve the exact error message strings
- **Package structure** — Follow the language's standard project layout
- **Testing framework** — Use the language's standard or most popular test framework
- **Linting** — Use the language's standard linter with strict settings
- **Type system** — Use the language's type system idiomatically (strong typing where available)

### Language-specific considerations

| Concern | Guidance |
|---|---|
| String vs number inputs | All public API inputs are strings (even `random`'s `length` parameter). Preserve this. |
| `null`/`nil`/`None` handling | The `"value must be a string - received <value>"` error must handle the language's null equivalent |
| Integer overflow | The algorithm only uses small numbers (max digit doubled = 18), so overflow is not a concern |
| Random number generation | Use the language's standard random library; no cryptographic RNG needed |
| Leading zeros | String-based operations preserve leading zeros naturally; do not convert to integers |
| Package naming | Use `luhn-<language>` or `luhn<language>` (e.g., `luhnpy`, `luhn-go`, `luhn-rs`) under the `@jrrembert` scope if the registry supports scoping |
