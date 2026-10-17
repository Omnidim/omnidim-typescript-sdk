# Changelog

All notable changes to this package are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2026-10-17

### Added

- `client.workflows` builds and runs workflows from TypeScript: `listNodeTypes`, `getNodeType`, `listFieldOptions`, `list`, `create`, `get`, `edit`, `delete`, `validate`, `publish`, `activate`, `deactivate`, `test`, and `getExecution`.
- Post-call action methods on `client.agents`: `listPostCallActions`, `addPostCallAction`, `updatePostCallAction`, and `deletePostCallAction`.
- `client.integrations.list` accepts the `user_id` query, so a reseller can list the integrations of a client.
- Reseller usage methods on `client.reseller`: `usage` for the whole account and `clientUsage` for one client organization.
- Voice cloning on `client.voices`: `listClonedVoices`, `createClonedVoice`, `getClonedVoice`, `updateClonedVoice`, `deleteClonedVoice`, `getClonedVoiceSample`, and `regenerateClonedVoiceSample`.
- More reseller operations on `client.reseller`: `setClientAccess`, `previewClientRelease`, `releaseClient`, `issueChildApiKey`, `revokeChildApiKey`, `getIdentity`, `saveIdentity`, `saveIdentitySmtp`, `testIdentitySmtp`, and `disableIdentitySmtp`.

## [0.7.0] - 2026-10-12

### Added

- `client.reseller.uploadKycDocument(step, fields, document, filename)` sends the document for a verification step whose `method` is `upload`, such as the PAN card after PAN verification. Takes a `Blob`, `File`, `Uint8Array` or `ArrayBuffer`. Without it a carrier that needs documents could not be verified from TypeScript.
- Any request body that is a `FormData` now goes as `multipart/form-data`, with the boundary header left to `fetch`.
- `submitKycStep` documents `return_url` on a `redirect` step, which brings your client back to your own app after verifying.

## [0.6.0] - 2026-09-09

### Added

- Ten bulk-call methods on `client.bulkCalls`: `listLines`, `start`, `addContact`, `addContacts`, `setConcurrency`, `setDailyTimeControl`, `retry`, `listNumbers`, `addNumber`, and `setNumberActive`. Everything past creating a campaign was previously unreachable from TypeScript, so a campaign could be created but not started, fed, throttled, or retried.

## [0.5.0] - 2026-09-09

### Added

- Reseller identity verification on `client.reseller`: `kycStatus`, `kycRequirements`, and `submitKycStep`. The generated types for these operations already shipped; the methods did not, so a TypeScript integration could create a client and fund it but could not verify one, which is the step between those and buying a number.

### Changed

- `carrier` is now required on number search, number purchase, and every verification step, matching the published API. Code that omitted it compiled before and no longer does, which is the point: the server refuses those calls with `409 carrier_required`.

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

- `client.account.balance()` for the organization's wallet: remaining balance, estimated minutes,
  active plan, concurrency headroom, and auto-recharge settings. Check `plan.is_usage_based`
  before treating a zero balance as a stop condition, since such an organization keeps placing
  calls and is metered to its payment method.
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
