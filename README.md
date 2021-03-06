# Skeleton API
[![CircleCI](https://circleci.com/gh/clevyr/skeleton-api.svg?style=svg)](https://circleci.com/gh/clevyr/skeleton-api)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fclevyr%2Fskeleton-api%2Fbadge&label=Build&style=flat)](https://actions-badge.atrox.dev/clevyr/skeleton-api/goto)

### Prereqs:
  - [NodeJS >= 8.0.0](https://nodejs.org/en/)
  - MySQL Server & Credentials

### Getting Started
  1. Clone the repository
  1. Install the necessary dependencies with `npm install`
  1. Create and configure a configuration file. (More info below)
  1. Build the project with `npm run build`
  1. Start the server with `npm run start`

### Configuration
  To configure your server, create a new file at `src/config/local.ts` and add the following (with any desired overrides from `src/config/default.ts`):
  ```js
  module.exports = {
    jwtSecret: 'Configure locally',
    database: {
      user: 'Configure locally',
      password: 'Configure locally',
    },
  };
  ```
  Note: the properties that have `Configure locally` should be changed

  You will need to rebuild any config changes with `npm run build`

### Contribution
  You can contribute to this repository by either submitting issues/feature requests on the issues tab at the top of the page, or by submitting your own changes via a Pull Request, both of which will be reviewed by the repository maintainers.

### Testing
  Tests can be run with `npm run test`, and run with code coverage using `npm run coverage`. The tests by default depend on a database called `skeletontest` existing, and will use your credentials from `local.ts` to authenticate.
