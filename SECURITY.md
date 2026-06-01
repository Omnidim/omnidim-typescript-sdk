# Security policy

## Reporting a vulnerability

Email `security@omnidim.io` with a description, reproduction steps, and the affected version. We aim to acknowledge within two business days and to issue a fix or mitigation within thirty days for confirmed issues.

Please do not file public issues for security reports.

## Handling credentials

This SDK authenticates with a Bearer API key. Keep the key in a server-side environment variable (for example `OMNIDIM_API_KEY`); never embed it in client-side or browser bundles. The SDK is intended for server-side use only.

## Supported versions

Only the latest minor version receives security fixes.
