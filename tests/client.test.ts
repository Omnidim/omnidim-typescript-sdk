import { describe, it, expect, vi } from "vitest";
import OmniDimension, { OmniDimensionError } from "../src/index.js";
import { HttpClient } from "../src/http.js";

interface Captured {
  url: string;
  init: RequestInit;
}

/** Build a fake fetch that records the call and returns a canned response. */
function fakeFetch(
  body: unknown,
  init: { status?: number; text?: string } = {},
): { fetch: typeof fetch; calls: Captured[] } {
  const calls: Captured[] = [];
  const status = init.status ?? 200;
  const text = init.text ?? (body === undefined ? "" : JSON.stringify(body));
  const fn = vi.fn(async (url: string | URL | Request, reqInit?: RequestInit) => {
    calls.push({ url: String(url), init: reqInit ?? {} });
    return new Response(text || null, {
      status,
      headers: { "content-type": "application/json" },
    });
  });
  return { fetch: fn as unknown as typeof fetch, calls };
}

function client(fetchImpl: typeof fetch, overrides = {}) {
  return new OmniDimension({ apiKey: "test-api-key-1234", fetch: fetchImpl, ...overrides });
}

describe("construction", () => {
  it("rejects a missing or too-short api key", () => {
    expect(() => new OmniDimension({ apiKey: "" })).toThrow(/API key is required/i);
    expect(() => new OmniDimension({ apiKey: "short" })).toThrow(/API key is required/i);
  });

  it("strips a trailing slash from baseURL", () => {
    const http = new HttpClient({
      apiKey: "test-api-key-1234",
      baseURL: "https://example.com/api/v1/",
      fetch: fakeFetch({}).fetch,
    });
    expect(http.baseURL).toBe("https://example.com/api/v1");
  });

  it("exposes all eight resources", () => {
    const c = client(fakeFetch({}).fetch);
    for (const r of [
      "agents",
      "calls",
      "bulkCalls",
      "knowledgeBase",
      "phoneNumbers",
      "providers",
      "simulations",
      "reseller",
    ] as const) {
      expect(c[r]).toBeDefined();
    }
  });
});

describe("requests", () => {
  it("sends the bearer auth header and Accept", async () => {
    const { fetch, calls } = fakeFetch({ bots: [] });
    await client(fetch).agents.list();
    const headers = calls[0]!.init.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-api-key-1234");
    expect(headers["Accept"]).toBe("application/json");
  });

  it("builds a query string and skips undefined values", async () => {
    const { fetch, calls } = fakeFetch({ bots: [] });
    await client(fetch).agents.list({ pageno: 2, pagesize: 50, name: undefined });
    expect(calls[0]!.url).toBe(
      "https://backend.omnidim.io/api/v1/agents?pageno=2&pagesize=50",
    );
  });

  it("repeats array query params", async () => {
    const { fetch, calls } = fakeFetch({});
    const http = new HttpClient({ apiKey: "test-api-key-1234", fetch });
    await http.request("GET", "/x", { query: { tag: ["a", "b"] } });
    expect(calls[0]!.url).toBe("https://backend.omnidim.io/api/v1/x?tag=a&tag=b");
  });

  it("sends a JSON body with Content-Type on POST", async () => {
    const { fetch, calls } = fakeFetch({ id: 1 });
    await client(fetch).calls.dispatch({ agent_id: 1, to_number: "+15551234567" } as never);
    const headers = calls[0]!.init.headers as Record<string, string>;
    expect(calls[0]!.init.method).toBe("POST");
    expect(headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(calls[0]!.init.body as string)).toEqual({
      agent_id: 1,
      to_number: "+15551234567",
    });
  });

  it("interpolates path parameters", async () => {
    const { fetch, calls } = fakeFetch({ id: 42 });
    await client(fetch).agents.get(42);
    expect(calls[0]!.url).toBe("https://backend.omnidim.io/api/v1/agents/42");
    expect(calls[0]!.init.method).toBe("GET");
  });

  it("does not attach a body to GET requests", async () => {
    const { fetch, calls } = fakeFetch({});
    await client(fetch).agents.list();
    expect(calls[0]!.init.body).toBeUndefined();
  });

  it("returns parsed JSON", async () => {
    const { fetch } = fakeFetch({ bots: [{ id: 1 }] });
    const result = (await client(fetch).agents.list()) as { bots: unknown[] };
    expect(result.bots).toHaveLength(1);
  });

  it("returns undefined for an empty body", async () => {
    const { fetch } = fakeFetch(undefined, { status: 204, text: "" });
    const result = await client(fetch).agents.delete(1);
    expect(result).toBeUndefined();
  });
});

describe("errors", () => {
  it("throws OmniDimensionError with the parsed error message", async () => {
    const { fetch } = fakeFetch(
      { error: "not_found", error_description: "Agent not found" },
      { status: 404 },
    );
    await expect(client(fetch).agents.get(999)).rejects.toMatchObject({
      name: "OmniDimensionError",
      status: 404,
      message: "Agent not found",
    });
  });

  it("falls back to a generic message when no error field is present", async () => {
    const { fetch } = fakeFetch({}, { status: 500 });
    await expect(client(fetch).agents.list()).rejects.toMatchObject({
      status: 500,
      message: "Request failed with status 500",
    });
  });

  it("wraps network failures as status 0", async () => {
    const fetch = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;
    const err = await client(fetch)
      .agents.list()
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(OmniDimensionError);
    expect((err as OmniDimensionError).status).toBe(0);
    expect((err as OmniDimensionError).message).toMatch(/Network error/);
  });

  it("times out and reports it", async () => {
    const fetch = vi.fn((_url: string, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError")),
        );
      });
    }) as unknown as typeof fetch;
    const err = await client(fetch, { timeout: 10 })
      .agents.list()
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(OmniDimensionError);
    expect((err as OmniDimensionError).message).toMatch(/timed out/);
  });
});
