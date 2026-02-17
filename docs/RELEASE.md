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

Releases are managed through GitHub Releases and automated via GitHub Actions:

1. Create and push a version tag
2. Create a GitHub Release
3. GitHub Actions automatically publishes to npm and GitHub Packages

### Current Release Status

**Published versions on npm**:
- `0.0.1-rc1` (Nov 25, 2022)
- `0.0.1-rc2` (Nov 25, 2022)
- `0.0.1-rc3` (Dec 13, 2024)

**Current version in package.json**: `0.0.1-rc3`

All releases are pre-releases (release candidates). No stable `1.0.0` has been published yet.

### Step-by-Step Release Guide

#### 1. Prepare the Release

Ensure all changes are committed and merged to `main`:

```bash
git checkout main
git pull origin main
```

Run the full test suite:

```bash
yarn test
yarn lint
yarn build
```

#### 2. Update Version

Update the version in `package.json`:

```json
{
  "version": "0.0.1-rc4"  // or "1.0.0" for stable release
}
```

Commit the version bump:

```bash
git add package.json
git commit -m "chore: bump version to 0.0.1-rc4"
git push origin main
```

#### 3. Create and Push Tag

```bash
# Create annotated tag
git tag -a v0.0.1-rc4 -m "Release v0.0.1-rc4"

# Push tag to GitHub
git push origin v0.0.1-rc4
```

**Tag naming convention**: Use `v` prefix (e.g., `v0.0.1-rc4`, `v1.0.0`)

#### 4. Create GitHub Release

Using GitHub CLI:

```bash
gh release create v0.0.1-rc4 \
  --title "v0.0.1-rc4" \
  --notes "**Full Changelog**: https://github.com/jrrembert/luhnjs/compare/v0.0.1-rc3...v0.0.1-rc4" \
  --prerelease  # Omit for stable releases
```

Or via GitHub web interface:
1. Navigate to https://github.com/jrrembert/luhnjs/releases/new
2. Select the tag you just created
3. Set release title (e.g., `v0.0.1-rc4`)
4. Add release notes
5. Check "This is a pre-release" for RC versions
6. Click "Publish release"

#### 5. Automated Publishing

Once the release is created, GitHub Actions automatically:

1. **Build Job** (`build`)
   - Checks out code
   - Sets up Node.js 16.x
   - Runs `yarn run build --if-present`

2. **Publish to npm** (`publish-npm`)
   - Runs after build succeeds
   - Publishes to https://registry.npmjs.org
   - Uses `NPM_TOKEN` secret for authentication
   - Publishes as public scoped package (`@jrrembert/luhnjs`)

3. **Publish to GitHub Packages** (`publish-gpr`)
   - Runs after build succeeds
   - Publishes to https://npm.pkg.github.com/
   - Uses automatic `GITHUB_TOKEN` for authentication

### Workflow Details

The publish workflow (`.github/workflows/yarn-publish-github-package.yml`):

- **Trigger**: `release.created` event
- **Node version**: 16.x
- **Publish command**: `yarn publish --access=public`
- **Dual publish**: Both npm and GitHub Packages

### Verification

After release, verify the publish succeeded:

```bash
# Check npm
npm view @jrrembert/luhnjs versions

# Check latest version
npm view @jrrembert/luhnjs version

# Install and test
npm install @jrrembert/luhnjs@latest
```

## Continuous Integration

### CI Workflow

The CI workflow (`.github/workflows/node.js.yml`) runs on:
- Push to `main`, `feature/*`, `fix/*`, `chore/*` branches
- Pull requests to `main`

**Test matrix**:
- Node.js versions: 14.x, 16.x, 18.x
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

### Publish Issues

**Problem**: Workflow doesn't trigger after creating release

- Verify the release was created (not just saved as draft)
- Check GitHub Actions tab for workflow runs
- Ensure the workflow file is on the `main` branch

**Problem**: npm publish fails with authentication error

- Verify `NPM_TOKEN` secret is configured in repository settings
- Token must have publish permissions for `@jrrembert` scope
- Generate new token at https://www.npmjs.com/settings/~/tokens

**Problem**: GitHub Packages publish fails

- Verify repository has `contents: read` and `packages: write` permissions
- Check that `GITHUB_TOKEN` has necessary scopes

### Version Mismatch

**Problem**: Published version doesn't match git tag

- Always update `package.json` version BEFORE creating the tag
- The workflow publishes whatever version is in `package.json` on that commit
- The tag name is just metadata for the release, not used for the package version

## Release Checklist

Before creating a release:

- [ ] All tests passing locally (`yarn test`)
- [ ] Linting passes (`yarn lint`)
- [ ] Build succeeds (`yarn build`)
- [ ] All changes merged to `main`
- [ ] `package.json` version updated
- [ ] Version bump committed and pushed
- [ ] CHANGELOG updated (run `yarn changelog`)
- [ ] Git tag created with `v` prefix
- [ ] Tag pushed to GitHub
- [ ] GitHub Release created (triggers publish workflow)
- [ ] Verify publish succeeded on npm
- [ ] Test installation: `npm install @jrrembert/luhnjs@<version>`

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

- **v0.0.1-rc3**: Latest release (Dec 13, 2024)
  - Added `random` function
  - Improved test coverage
  - Fixed linting issues

### Workflow Evolution

The publish workflow was added and refined across rc0-rc2:
- Commit `5bda004`: Initial npm publish workflow setup
- Commit `832d525`: Added GitHub Packages publishing
- Commit `f764bf1`: Version fixes
- Commit `cfcf478`: Package name and scope configuration

## Future Improvements

Potential enhancements to the release process:

1. **Automate version bumping**
   - Add `npm version` script to handle package.json updates
   - Consider semantic-release for fully automated releases

2. **Multi-registry support**
   - Document GitHub Packages installation for consumers
   - Consider publishing to additional registries

3. **Release notes automation**
   - Auto-generate from conventional commits
   - Include contributor attribution

4. **Version 1.0.0 readiness**
   - Finalize API stability
   - Complete documentation
   - Full test coverage including experimental features
