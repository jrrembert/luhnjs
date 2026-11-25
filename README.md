# luhnjs

[![Node.js CI](https://github.com/jrrembert/luhnjs/actions/workflows/node.js.yml/badge.svg)](https://github.com/jrrembert/luhnjs/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/jrrembert/luhnjs/graph/badge.svg)](https://codecov.io/gh/jrrembert/luhnjs)

A TypeScript implementation of the Luhn algorithm for generating and validating checksums.

Published as [`@jrrembert/luhnjs`](https://www.npmjs.com/package/@jrrembert/luhnjs) on npm.

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) (>=22.x) and [Yarn](https://yarnpkg.com/).

### Installation

```bash
# npm
$ npm install @jrrembert/luhnjs

# yarn
$ yarn add @jrrembert/luhnjs
```

### Usage

```typescript
import {
  generate,
  validate,
  random,
  generateModN,
  validateModN,
  checksumModN,
} from '@jrrembert/luhnjs';

// Generate a checksum
generate('7992739871');               // '79927398713'
generate('7992739871', { checkSumOnly: true }); // '3'

// Validate a checksum
validate('79927398713');              // true

// Generate a random number with valid checksum
random('16');                         // e.g. '4539148803436467'

// Mod-N variants (base 2–36, supports alphanumeric)
generateModN('1', 16);               // '1E'
validateModN('1E', 16);              // true
checksumModN('12345', 10);           // 5
```

## Commands

```bash
# Install dependencies
$ yarn

# Run tests
$ yarn test

# Lint
$ yarn lint

# Build
$ yarn build
```

## Documentation

<!-- TODO: Add link to API reference when published -->
- [Specification](docs/SPEC.md) - API specification
- [Release Process](docs/RELEASE.md) - Automated releases via semantic-release
- [CI/CD](docs/CI.md) - Workflows and troubleshooting
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Security](SECURITY.md) - Reporting vulnerabilities

## Contact

Email: [J. Ryan Rembert](mailto:j.ryan.rembert@gmail.com)

## License

[MIT](LICENSE)

Copyright © 2022-2026 J. Ryan Rembert


## Development and release runtime

The published library supports Node.js 22 and later. Installing development
dependencies and running semantic-release 26 requires Node.js 26.13 or later.
CI installs with Node.js 26.13.1, then runs lint, build, and tests on both
Node.js 22 and 26. The release job uses Node.js 26.13.1.
