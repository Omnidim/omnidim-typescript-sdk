# Changelog

All notable changes to this package are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Agent version-history methods on `client.agents`: `listVersions`, `saveVersion`, `diffVersion` (with `against` = previous / current / a version number), `restoreVersion`, `renameVersion`, `deleteVersion`.
- `PATCH` support in the HTTP client (used by `renameVersion`).

## [0.1.1] - 2026-06-19

### Changed

- Regenerated API types from the latest OpenAPI spec: adds the bulk-call add-contact operation and updated model and voice-provider enums.

### Fixed

- Trailing-slash trimming of the base URL no longer uses a backtracking regular expression.

## [0.1.0]

Initial release.

- `OmniDimension` client with Bearer-key authentication.
- Resources: `agents`, `calls`, `bulkCalls`, `knowledgeBase`, `phoneNumbers`, `providers`, `integrations`, `reseller`.
- `OmniDimensionError` for non-2xx responses, with status code and parsed error body.
