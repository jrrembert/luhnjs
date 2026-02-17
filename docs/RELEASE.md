# Release and Build Process

This document describes the build system and release process for `@jrrembert/luhnjs`.

## Build Process

### Local Development Build

```bash
yarn build
```

This runs: `tsc && node dist/index.js`

1. **`tsc`** - Compiles TypeScript to JavaScript
   - Input: `index.ts` (specified in `tsconfig.json`)
   - Output: `dist/` directory with compiled `.js` and `.d.ts` files
   - Target: ES2017, CommonJS modules
   - Generates type declarations for TypeScript consumers

2. **`node dist/index.js`** - Smoke test
   - Validates the build succeeded by running the compiled entry point
   - Ensures the module can be loaded without errors
   - Does not produce output unless there's an error

### Build Artifacts

The build produces:
- `dist/index.js` - Compiled entry point
- `dist/index.d.ts` - TypeScript type definitions
- `dist/src/luhn.js` - Compiled implementation
- `dist/src/luhn.d.ts` - Type definitions for implementation

**Important**: The `dist/` directory is gitignored and must be rebuilt for each publish.

### Package Configuration

From `package.json`:
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["/dist"]
}
```

Only the `/dist` directory is included in published packages. Source TypeScript files are excluded.

## Release Process

### Overview

Releases are fully automated via [semantic-release](https://github.com/semantic-release/semantic-release). When commits are pushed to `main`, semantic-release:

1. Analyzes commit messages to determine the version bump (major/minor/patch)
2. Updates `package.json` version and `CHANGELOG.md`
3. Publishes to npm
4. Creates a GitHub Release with auto-generated release notes
5. Commits the version bump and CHANGELOG back to the repository

No manual versioning, tagging, or publishing is needed.

### How It Works

#### Commit Message → Version Bump

semantic-release uses [conventional commits](https://www.conventionalcommits.org/) to determine the version bump:

| Commit prefix | Version bump | Example |
|---|---|---|
| `fix:` | Patch (1.0.0 → 1.0.1) | `fix: handle empty string input` |
| `feat:` | Minor (1.0.0 → 1.1.0) | `feat: add batch validation` |
| `feat!:` or `BREAKING CHANGE:` footer | Major (1.0.0 → 2.0.0) | `feat!: rename generate to compute` |
| `chore:`, `docs:`, `refactor:`, `test:` | No release | `chore: update dependencies` |

#### Release Workflow

The GitHub Actions workflow (`.github/workflows/release.yml`) runs on every push to `main`:

1. **Checkout** with full git history (`fetch-depth: 0`)
2. **Setup Node.js** 22.x with yarn cache
3. **Install dependencies** (`yarn --frozen-lockfile`)
4. **Lint** (`yarn lint`)
5. **Build** (`yarn build`)
6. **Test** (`yarn test`)
7. **Release** (`npx semantic-release`)

If no releasable commits are found (e.g., only `chore:` commits), semantic-release skips the release step.

#### Configuration

semantic-release is configured in `.releaserc.json` with these plugins:

1. `@semantic-release/commit-analyzer` — determines version bump from commits
2. `@semantic-release/release-notes-generator` — generates release notes
3. `@semantic-release/changelog` — writes CHANGELOG.md
4. `@semantic-release/npm` — publishes to npm
5. `@semantic-release/github` — creates GitHub Release
6. `@semantic-release/git` — commits CHANGELOG.md and package.json back to repo

### Environment Requirements

The release workflow requires these secrets:

- `NPM_TOKEN` — npm publish authentication (configured in repository settings)
- `GITHUB_TOKEN` — automatic, provided by GitHub Actions

### Verification

After a release, verify it succeeded:

```bash
# Check npm
npm view @jrrembert/luhnjs versions

# Check latest version
npm view @jrrembert/luhnjs version

# Install and test
npm install @jrrembert/luhnjs@latest
```

You can also check the [GitHub Releases page](https://github.com/jrrembert/luhnjs/releases) and the [Actions tab](https://github.com/jrrembert/luhnjs/actions/workflows/release.yml) for workflow run status.

### Dry Run

To test what semantic-release would do without actually publishing:

```bash
npx semantic-release --dry-run
```

## Continuous Integration

### CI Workflow

The CI workflow (`.github/workflows/node.js.yml`) runs on:
- Push to `main`, `feature/*`, `fix/*`, `chore/*` branches
- Pull requests to `main`

**Test matrix**:
- Node.js versions: 18.x, 20.x, 22.x
- Steps: install, lint, build, test

## Troubleshooting

### Build Issues

**Problem**: `tsc` compilation fails

```bash
# Clean and rebuild
rm -rf dist/
yarn build
```

**Problem**: `node dist/index.js` fails after successful `tsc`

- Check for runtime errors in the compiled code
- Verify all dependencies are listed in `package.json`
- Check for circular dependencies

### Release Issues

**Problem**: Release workflow ran but no release was created

- Check commit messages — only `feat:` and `fix:` prefixes trigger releases
- Commits with `chore:`, `docs:`, `refactor:`, `test:` prefixes do not trigger releases
- Run `npx semantic-release --dry-run` locally to debug

**Problem**: npm publish fails with authentication error

- Verify `NPM_TOKEN` secret is configured in repository settings
- Token must have publish permissions for `@jrrembert` scope
- Generate new token at https://www.npmjs.com/settings/~/tokens

**Problem**: Release creates wrong version bump

- Review commit messages for correct conventional commit format
- A `feat:` commit triggers minor bump, `fix:` triggers patch
- Use `BREAKING CHANGE:` footer or `!` suffix for major bumps

### Version Mismatch

This is no longer an issue with semantic-release — version management is fully automated. The version in `package.json`, the git tag, and the npm publish version are always in sync.

## Historical Notes

### Previous Releases

- **v0.0.1-rc0**: Initial release attempt (Nov 25, 2022)
  - Tag created but may not have published successfully
  - Not found in npm registry

- **v0.0.1-rc1**: First successful npm publish (Nov 25, 2022)
  - Set up initial publish workflow
  - Configured scoped package name

- **v0.0.1-rc2**: Package configuration fixes (Nov 25, 2022)
  - Updated GitHub Packages configuration
  - Same day as rc1, addressing publish issues

- **v0.0.1-rc3**: Latest pre-semantic-release version (Dec 13, 2024)
  - Added `random` function
  - Improved test coverage
  - Fixed linting issues

### Release Process Evolution

- **2022**: Manual release process with GitHub Actions publish workflow
- **2025**: Added CHANGELOG generation via `conventional-changelog-cli`
- **2026**: Adopted semantic-release for fully automated releases

## Future Improvements

Potential enhancements to the release process:

1. **Multi-registry support**
   - Document GitHub Packages installation for consumers
   - Consider publishing to additional registries

2. **Version 1.0.0 readiness**
   - Finalize API stability
   - Complete documentation
   - Full test coverage including experimental features
