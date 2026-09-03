# Changelog

All notable changes to this package are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.2] - 2026-09-03

### Added

- `timezone` on agent create and update input and on the agent response: an IANA timezone name (e.g. `Asia/Kolkata`) that sets the local date and time the agent works with during calls. Unset, the account timezone applies.

### Changed

- Regenerated types from the current published API spec, catching up additions the previous release predated (per-contact bulk-call results types, per-call languages).

## [0.3.0] - 2026-08-26

### Added

- Phone number provisioning on `client.phoneNumbers`: `search`, `purchase` (accepts an idempotency key so a retry cannot charge twice), `release`.
- `user_id` on `client.phoneNumbers.list`, for reseller accounts listing a client's numbers.

## [0.2.0] - 2026-07-29

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
