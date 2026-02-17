# luhnjs

[![Node.js CI](https://github.com/jrrembert/luhnjs/actions/workflows/node.js.yml/badge.svg)](https://github.com/jrrembert/luhnjs/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/jrrembert/luhnjs/graph/badge.svg)](https://codecov.io/gh/jrrembert/luhnjs)

A TypeScript implementation of the Luhn algorithm for generating and validating checksums.

Published as [`@jrrembert/luhnjs`](https://www.npmjs.com/package/@jrrembert/luhnjs) on npm.

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) (>=20.x) and [Yarn](https://yarnpkg.com/).

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
- [Specification](docs/SPEC.md) - API specification and cross-language port alignment
- [Release Process](docs/RELEASE.md) - Automated releases via semantic-release
- [CI/CD](docs/CI.md) - Workflows and troubleshooting
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Security](SECURITY.md) - Reporting vulnerabilities

## Contact

Email: [J. Ryan Rembert](mailto:j.ryan.rembert@gmail.com)

## License

[MIT](LICENSE)

Copyright © 2022-2026 J. Ryan Rembert
