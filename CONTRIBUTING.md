# Contributing

Thanks for your interest in contributing to luhnjs! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Getting Started

```bash
git clone https://github.com/jrrembert/luhnjs.git
cd luhnjs
yarn install
```

## Development

```bash
yarn lint    # Run ESLint
yarn test    # Run tests
yarn build   # Compile TypeScript
```

## Workflow

1. Open a GitHub issue describing the change
2. Create a branch from `rc` (for `feat:`/`fix:` changes) or `main` (for `docs:`/`chore:` changes)
   - Branch naming: `feature/`, `fix/`, `chore/`, `docs/` prefixes
3. Write a failing test, then implement the fix or feature (TDD)
4. Ensure `yarn lint && yarn test && yarn build` all pass
5. Commit using [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.)
6. Open a pull request with `Closes #N` in the description

## Code Style

ESLint enforces the project's style. Run `yarn lint` to check. Key rules: single quotes, 2-space indentation, semicolons required, trailing commas on multiline.
