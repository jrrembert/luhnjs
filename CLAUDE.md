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

## Architecture

- `index.ts` - Entry point re-exporting the public API: `generate`, `validate`, `random`, `generateModN`, `luhnModN`
- `src/luhn.ts` - All algorithm implementations
- `src/luhn.spec.ts` - Co-located Jest tests (ts-jest preset)

## Git Workflow

- Primary branch is `main`
- Never push directly to `main`
- Every change must have a GitHub issue. If the user provides an issue number, use it. Otherwise, create one before starting work
- Every PR must include `Closes #N` in the body to auto-close its issue on merge
- Branch naming: use prefixes `feature/`, `fix/`, `chore/` (e.g., `feature/add-auth`, `fix/login-bug`)
- Commits, PR titles, and issue titles follow conventional commit format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- PRs require at least one review before merging to `main`
- Always merge PRs via GitHub UI or `gh pr merge` — never merge locally with `git merge` then push. Local merges break GitHub's `Closes #N` auto-close linking.
- PRs always target `main` unless the user explicitly specifies a different base branch
- Use `/pr` or `/pr <issue-number>` to create pull requests with the standard format
- Always create the feature branch from `main` **before** writing code, not at commit time

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