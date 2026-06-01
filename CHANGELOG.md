# Changelog

All notable changes to this package are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0]

Initial release.

- `OmniDimension` client with Bearer-key authentication.
- Resources: `agents`, `calls`, `bulkCalls`, `knowledgeBase`, `phoneNumbers`, `providers`, `simulations`, `integrations`, `reseller`.
- Request and response types generated from the OmniDimension OpenAPI spec.
- `OmniDimensionError` for non-2xx responses, with status code and parsed error body.
