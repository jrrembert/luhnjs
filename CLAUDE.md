# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TypeScript library implementing the Luhn algorithm for generating and validating checksums (commonly used for credit card validation). Published as `@jrrembert/luhnjs` on npm.

## Commands

```bash
yarn              # Install dependencies
yarn build        # Compile TypeScript to dist/
yarn test         # Run all tests
yarn test src/luhn.spec.ts                # Run a single test file
yarn test --testNamePattern="generate"    # Run tests matching a pattern
yarn lint         # Lint with ESLint
```

## Releases

Releases are fully automated via [semantic-release](https://github.com/semantic-release/semantic-release). No manual versioning or publishing is needed. See `docs/RELEASE.md` for details.

- **Release candidates**: Push `feat:`/`fix:` commits to the `rc` branch → publishes pre-release versions (e.g., `1.0.0-rc.1`)
- **Stable releases**: Merge `rc` into `main` → publishes stable versions (e.g., `1.0.0`)
- Every stable release must be preceded by at least one release candidate

## Architecture

- `index.ts` - Entry point re-exporting the public API: `generate`, `validate`, `random`, `generateModN`, `validateModN`, `checksumModN`
- `src/luhn.ts` - All algorithm implementations
- `src/luhn.spec.ts` - Co-located Jest tests (ts-jest preset)

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
- Always merge PRs via GitHub UI or `gh pr merge` — never merge locally with `git merge` then push. Local merges break GitHub's `Closes #N` auto-close linking.
- PRs use the template at `.github/PULL_REQUEST_TEMPLATE.md` — fill in all sections (Summary, Changes, Test plan)
- Use `/pr` or `/pr <issue-number>` to create pull requests with the standard format
- Always create the feature branch from `rc` **before** writing code, not at commit time
- Use a git worktree for implementation work (e.g., `git worktree add ../luhnjs-<name> <branch>`). This avoids issues with stale branch state in the main working directory

This project follows Test-Driven Development (TDD). For every feature or bug fix:

1. **Red**: Write a failing test first that defines the expected behavior
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Clean up the code while keeping tests green

## Code Style

ESLint enforces: single quotes, 2-space indentation, semicolons required, trailing commas on multiline, blank line before `return` statements, no space before named function parentheses (`function foo()` not `function foo ()`).

## PR Review Workflow

- To fetch line-level review comments, filter to only needed fields:
  ```bash
  gh api repos/{owner}/{repo}/pulls/{n}/comments --jq '.[] | {id, body, path, line}'
  ```
- Reply to a comment using its `id`:
  ```bash
  gh api repos/{owner}/{repo}/pulls/{n}/comments/{id}/replies -f body="..."
  ```

## Documentation

- When making changes that affect setup, build, or test commands, update both this file and `README.md`
- Project specification lives in `docs/SPEC.md` — update when requirements or architecture change