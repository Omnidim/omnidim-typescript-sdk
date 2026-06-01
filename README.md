# @omnidim-ai/sdk

Official JavaScript and TypeScript SDK for the [OmniDimension](https://omnidim.io) voice-AI REST API. Manage agents, dispatch calls, run bulk campaigns, knowledge bases, phone numbers, and simulations from Node.js.

Types are generated from the [OmniDimension OpenAPI spec](https://docs.omnidim.io/openapi.yaml), so request and response shapes stay in sync with the API.

## Install

```bash
npm install @omnidim-ai/sdk
```

Requires Node.js 20 or later. This is a server-side SDK; do not ship your API key to a browser.

## Quick start

```ts
import OmniDimension from "@omnidim-ai/sdk";

const client = new OmniDimension({ apiKey: process.env.OMNIDIM_API_KEY! });

const agents = await client.agents.list({ pagesize: 10 });

const call = await client.calls.dispatch({
  agent_id: 123,
  to_number: "+15551234567",
});
```

Get an API key at [omnidim.io/api-management](https://omnidim.io/api-management).

## Resources

The client exposes one accessor per API area:

| Accessor | Covers |
|---|---|
| `client.agents` | List, create, get, update, delete agents |
| `client.calls` | Dispatch outbound calls, list and read call logs |
| `client.bulkCalls` | Create and manage bulk-call campaigns, live status |
| `client.knowledgeBase` | Upload, list, attach, detach, delete knowledge files |
| `client.phoneNumbers` | List numbers, attach, detach, import from Twilio/Exotel/SIP |
| `client.providers` | List LLM, voice, STT, TTS providers; voice details |
| `client.simulations` | Create, run, start, stop, and manage simulations |
| `client.integrations` | List, create (custom API, Cal.com), attach to and detach from agents |
| `client.reseller` | Partner operations (requires partner-level credentials) |

Every method returns a promise that resolves to the parsed JSON response, typed from the spec.

## Error handling

Non-2xx responses and network failures throw `OmniDimensionError`:

```ts
import { OmniDimensionError } from "@omnidim-ai/sdk";

try {
  await client.agents.get(999);
} catch (err) {
  if (err instanceof OmniDimensionError) {
    console.error(err.status, err.message, err.body);
  }
}
```

`status` is the HTTP status code (0 for network or timeout errors). `body` is the parsed error payload when present.

## Configuration

```ts
new OmniDimension({
  apiKey: "...",
  baseURL: "https://backend.omnidim.io/api/v1", // override the API host
  timeout: 60000,                                // per-request timeout in ms
  fetch: customFetch,                            // custom fetch implementation
  defaultHeaders: { "X-My-Header": "value" },    // headers on every request
});
```

## Types

Schema types are exported for use in your own code:

```ts
import type { Agent, Call, Voice } from "@omnidim-ai/sdk";
```

## Links

- API reference: [docs.omnidim.io](https://docs.omnidim.io)
- OpenAPI spec: [docs.omnidim.io/openapi.yaml](https://docs.omnidim.io/openapi.yaml)
- Issues: [github.com/Omnidim/omnidim-js-sdk/issues](https://github.com/Omnidim/omnidim-js-sdk/issues)

## License

MIT
