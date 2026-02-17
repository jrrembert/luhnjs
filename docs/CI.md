# Continuous Integration (CI)

This document describes the CI/CD workflows configured for `@jrrembert/luhnjs`.

## Overview

The project uses GitHub Actions for continuous integration with four automated workflows:

1. **Node.js CI** - Build, lint, and test on multiple Node versions
2. **Dependency Review** - Security scanning for vulnerable dependencies
3. **Publish** - Automated npm publishing on release
4. **Copyright Update** - Annual copyright year automation

## Workflows

### 1. Node.js CI

**File**: `.github/workflows/node.js.yml`

**Purpose**: Validates code quality on every push and pull request.

#### Triggers

- **Push** to branches:
  - `main`
  - `feature/*`
  - `fix/*`
  - `chore/*`

- **Pull requests** targeting `main`

#### Build Matrix

Tests across multiple Node.js versions for compatibility:

- Node.js 18.x
- Node.js 20.x
- Node.js 22.x

#### Steps

1. **Checkout code** (`actions/checkout@v3`)
2. **Setup Node.js** with specified version
   - Uses Yarn cache for faster installs
3. **Install dependencies** (`yarn --frozen-lockfile`)
   - Ensures exact versions from `yarn.lock`
   - Fails if lockfile is out of sync
4. **Lint** (`yarn lint`)
   - Runs ESLint with project configuration
   - Enforces code style consistency
5. **Build** (`yarn run build --if-present`)
   - Compiles TypeScript to JavaScript
   - Runs smoke test: `node dist/index.js`
6. **Test** (`yarn test`)
   - Runs Jest test suite
   - Requires all tests to pass

#### Success Criteria

All three Node.js versions must:
- Install dependencies without errors
- Pass linting checks
- Build successfully
- Pass all tests

#### Viewing Results

```bash
# List recent CI runs
gh run list --workflow="Node.js CI" --limit 10

# View specific run
gh run view <run-id>

# View logs for failed run
gh run view <run-id> --log-failed
```

### 2. Dependency Review

**File**: `.github/workflows/dependency-review.yml`

**Purpose**: Prevents merging PRs that introduce known vulnerable dependencies.

#### Triggers

- **Pull requests** only (all branches)

#### How It Works

1. Scans `package.json` and `yarn.lock` changes
2. Compares against GitHub's security advisories
3. Blocks merge if vulnerable packages detected
4. Fails the check if critical/high severity vulnerabilities found

#### Permissions

- `contents: read` - Read-only access to repository

#### What It Checks

- Direct dependencies added/updated
- Transitive dependencies introduced
- Known CVEs in npm packages
- Severity levels: critical, high, moderate, low

#### Handling Failures

If dependency review fails:

1. **View the failure details**:
   ```bash
   gh run view <run-id>
   ```

2. **Check for vulnerabilities**:
   ```bash
   yarn audit
   ```

3. **Options**:
   - Update to non-vulnerable version
   - Find alternative package
   - If false positive, document reasoning in PR
   - For legacy/accepted risk, may need security exception

#### Best Practices

- Keep dependencies up to date
- Review dependency changes in PRs carefully
- Use `yarn audit` locally before pushing
- Pin dependencies to specific versions for predictability

### 3. Publish

**File**: `.github/workflows/yarn-publish-github-package.yml`

**Purpose**: Automatically publishes to npm and GitHub Packages when a release is created.

See [RELEASE.md](RELEASE.md) for detailed documentation.

#### Quick Reference

- **Trigger**: GitHub Release created
- **Publishes to**:
  - npm (https://registry.npmjs.org)
  - GitHub Packages (https://npm.pkg.github.com/)
- **Node version**: 16.x
- **Authentication**: `NPM_TOKEN` secret, automatic `GITHUB_TOKEN`

### 4. Copyright Update

**File**: `.github/workflows/update-copyright-date.yml`

**Purpose**: Automatically updates copyright year in README.md annually.

#### Triggers

- **Schedule**: `0 0 1 1 *` (January 1st at midnight UTC)

#### How It Works

1. Runs `update-copyright-date.sh README.md`
2. Updates copyright line: `Copyright © 2022-YYYY` → `Copyright © 2022-2027`
3. Commits and pushes changes directly to `main`

#### Script Details

`update-copyright-date.sh`:
- Uses `sed` to find and update copyright pattern
- Preserves original start year
- Updates end year to current year
- Pattern: `© YYYY-YYYY` or `© YYYY`

#### Known Issues

**January 1, 2026 Failure**:
- The workflow run failed at "Push to repository" step
- Exit code 1 suggests permission issue or no changes to commit
- Possible causes:
  - Copyright already updated manually
  - Insufficient permissions for automated commits
  - Protected branch rules blocking bot commits

#### Manual Copyright Update

If automated update fails:

```bash
# Run the script locally
./update-copyright-date.sh README.md

# Verify changes
git diff README.md

# Commit and push
git add README.md
git commit -m "chore: update copyright year"
git push origin main
```

#### Configuration

The workflow uses bot credentials:
- **Name**: "Ryan Rembert"
- **Email**: "jrrembert@users.noreply.github.com"

## CI Status Badges

Add to README.md:

```markdown
![Node.js CI](https://github.com/jrrembert/luhnjs/workflows/Node.js%20CI/badge.svg)
![Dependency Review](https://github.com/jrrembert/luhnjs/workflows/Dependency%20Review/badge.svg)
```

## Local CI Simulation

Run the same checks locally before pushing:

```bash
# Full CI suite
yarn install --frozen-lockfile
yarn lint
yarn build
yarn test

# Quick check
yarn lint && yarn test
```

## Workflow Management

### Listing Workflows

```bash
# List all workflows
gh workflow list

# View workflow details
gh workflow view "Node.js CI"
```

### Running Workflows Manually

Some workflows support manual triggers:

```bash
# Trigger a workflow manually (if workflow_dispatch enabled)
gh workflow run "Node.js CI"
```

### Disabling Workflows

```bash
# Disable a workflow
gh workflow disable "update copyright date in README"

# Re-enable
gh workflow enable "update copyright date in README"
```

## Troubleshooting

### Common Failures

#### Lint Failures

**Symptom**: ESLint step fails

**Solutions**:
```bash
# Run locally to see errors
yarn lint

# Auto-fix where possible
yarn lint --fix

# Check specific file
yarn eslint src/luhn.ts
```

#### Build Failures

**Symptom**: TypeScript compilation fails

**Common causes**:
- Type errors in code
- Missing dependencies
- Circular imports

**Solutions**:
```bash
# Clean build
rm -rf dist/
yarn build

# Check TypeScript errors
yarn tsc --noEmit
```

#### Test Failures

**Symptom**: Jest tests fail in CI but pass locally

**Common causes**:
- Environment-specific behavior
- Timing issues
- Uncommitted test fixtures

**Solutions**:
```bash
# Run tests with CI environment
CI=true yarn test

# Run specific test
yarn test src/luhn.spec.ts

# Run with verbose output
yarn test --verbose
```

#### Frozen Lockfile Failures

**Symptom**: `yarn --frozen-lockfile` fails

**Cause**: `yarn.lock` is out of sync with `package.json`

**Solution**:
```bash
# Regenerate lockfile
yarn install

# Commit updated lockfile
git add yarn.lock
git commit -m "chore: update yarn.lock"
```

### Debugging Workflow Runs

#### View Recent Runs

```bash
# All workflows
gh run list --limit 20

# Specific workflow
gh run list --workflow="Node.js CI" --limit 10

# Only failures
gh run list --workflow="Node.js CI" --status failure
```

#### Inspect Failed Run

```bash
# Get run ID
gh run list --workflow="Node.js CI" --limit 1 --json databaseId --jq '.[0].databaseId'

# View run details
gh run view <run-id>

# View failed logs
gh run view <run-id> --log-failed

# Download all logs
gh run download <run-id>
```

#### Re-run Failed Workflow

```bash
# Re-run failed jobs only
gh run rerun <run-id> --failed

# Re-run entire workflow
gh run rerun <run-id>
```

### Secrets Management

#### Required Secrets

- `NPM_TOKEN` - npm publish authentication (configured in repository settings)

#### Checking Secrets

```bash
# Secrets are not readable, but you can list configured ones
gh secret list
```

#### Updating Secrets

```bash
# Set secret via CLI
gh secret set NPM_TOKEN

# Or via GitHub UI:
# Settings > Secrets and variables > Actions > New repository secret
```

## Performance Optimization

### Current Timing

Typical CI run times (per Node version):
- Install dependencies: ~30-45s (with cache)
- Lint: ~5-10s
- Build: ~5-8s
- Test: ~3-5s

**Total**: ~1 minute per Node version (~3 minutes for full matrix)

### Caching

Workflows use GitHub Actions cache:
- Node modules cached by `setup-node` action
- Cache key: `node-version` + `yarn.lock` hash
- Invalidated when dependencies change

### Optimization Tips

1. **Use `--frozen-lockfile`** - Faster than `yarn install`
2. **Leverage caching** - Already configured
3. **Parallelize jobs** - Matrix builds run in parallel
4. **Skip redundant steps** - Use `--if-present` flags

## Security Considerations

### Permissions

Workflows follow least-privilege principle:
- **Node.js CI**: No special permissions needed
- **Dependency Review**: `contents: read` only
- **Publish**: `contents: read`, `packages: write`
- **Copyright Update**: Requires push access to `main`

### Protected Branches

If `main` is protected:
- Direct commits from workflows may fail
- Copyright update workflow needs exemption or should create PR instead
- Consider using bot account with write permissions

### Secrets Safety

- Never log secrets
- Use `${{ secrets.NAME }}` syntax
- Secrets are redacted in logs automatically
- Rotate tokens periodically

## Maintenance

### Regular Tasks

- **Weekly**: Review failed workflows
- **Monthly**: Update workflow dependencies (`actions/*@v3` → `@v4`)
- **Quarterly**: Review Node.js versions in test matrix
- **Annually**: Update copyright automation script

### Updating Actions

```bash
# Check for outdated actions in workflow files
grep -r "uses: actions" .github/workflows/

# Update to latest versions
# Example: actions/checkout@v3 → actions/checkout@v4
```

### Node.js Version Updates

When adding new Node.js LTS versions:

1. Edit `.github/workflows/node.js.yml`
2. Add version to matrix: `node-version: [18.x, 20.x, 22.x]`
3. Test locally with new version
4. Consider removing EOL versions

## CI History

### Workflow Evolution

- **Initial setup** (2022): Basic Node.js CI with build and test
- **Dependency review** (2022): Added security scanning
- **Publish automation** (2022): Automated npm publishing
- **Copyright automation** (2022): Annual copyright updates
- **Matrix expansion** (2025): Updated branch triggers to include all prefixes

### Recent Runs

As of February 2026:
- **Node.js CI**: 100% success rate on recent runs
- **Dependency Review**: All PRs passing
- **Publish**: No recent releases (last: v0.0.1-rc3, Dec 2024)
- **Copyright Update**: Failed Jan 1, 2026 (needs investigation)

## Future Improvements

### Planned Enhancements

1. **Code coverage reporting**
   - Add coverage generation to test step
   - Upload to Codecov or Coveralls
   - Add coverage badge to README

2. **Performance benchmarking**
   - Add benchmark job for algorithm performance
   - Track performance over time
   - Alert on regressions

3. **Release automation**
   - Add `release-please` for automatic versioning
   - Generate changelogs from commits
   - Create releases automatically

4. **Preview deployments**
   - Deploy documentation on PR preview
   - If adding examples, deploy to GitHub Pages

5. **Notification improvements**
   - Slack/Discord notifications for failures
   - Only notify on main branch failures
   - Weekly summary reports

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [actions/checkout](https://github.com/actions/checkout)
- [actions/setup-node](https://github.com/actions/setup-node)
- [Dependency Review Action](https://github.com/actions/dependency-review-action)
- [GitHub CLI](https://cli.github.com/manual/gh_run)
