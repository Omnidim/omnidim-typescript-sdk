import { OmniDimensionError } from "./errors.js";

export const DEFAULT_BASE_URL = "https://backend.omnidim.io/api/v1";

export interface ClientOptions {
  /** Your OmniDimension API key. Get one at https://omnidim.io/api-management */
  apiKey: string;
  /** Override the API base URL. Defaults to production. */
  baseURL?: string;
  /** Custom fetch implementation. Defaults to the global `fetch`. */
  fetch?: typeof fetch;
  /** Per-request timeout in milliseconds. Defaults to 60000. */
  timeout?: number;
  /** Headers added to every request. */
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
  query?: Record<string, unknown> | undefined;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function buildQuery(query: Record<string, unknown> | undefined): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, String(item));
    } else {
      params.append(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export class HttpClient {
  readonly baseURL: string;
  private readonly apiKey: string;
  private readonly fetchImpl: typeof fetch;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: ClientOptions) {
    const apiKey = options.apiKey?.trim();
    if (!apiKey || apiKey.length < 8) {
      throw new Error(
        "An OmniDimension API key is required. Get one at https://omnidim.io/api-management",
      );
    }
    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (typeof fetchImpl !== "function") {
      throw new Error(
        "No global fetch found. Use Node 20+ or pass a `fetch` implementation.",
      );
    }
    this.apiKey = apiKey;
    this.baseURL = (options.baseURL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchImpl = fetchImpl;
    this.timeout = options.timeout ?? 60_000;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  async request<T>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = this.baseURL + path + buildQuery(options.query);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
      ...this.defaultHeaders,
      ...options.headers,
    };

    const hasBody = options.body !== undefined && method !== "GET";
    if (hasBody) headers["Content-Type"] = "application/json";

    const controller = new AbortController();
    const onAbort = () => controller.abort();
    if (options.signal) {
      if (options.signal.aborted) controller.abort();
      else options.signal.addEventListener("abort", onAbort, { once: true });
    }
    const timer = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method,
        headers,
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      const aborted = controller.signal.aborted;
      throw new OmniDimensionError(
        0,
        aborted
          ? `Request to ${method} ${path} timed out after ${this.timeout}ms`
          : `Network error on ${method} ${path}: ${(err as Error).message}`,
      );
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", onAbort);
    }

    const text = await response.text();
    let parsed: unknown = undefined;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    if (!response.ok) {
      throw new OmniDimensionError(
        response.status,
        extractErrorMessage(parsed, response),
        parsed,
      );
    }

    return parsed as T;
  }
}

function extractErrorMessage(body: unknown, response: Response): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const candidate =
      record["error_description"] ?? record["error"] ?? record["detail"] ?? record["message"];
    if (typeof candidate === "string" && candidate) return candidate;
  }
  if (typeof body === "string" && body) return body;
  return `Request failed with status ${response.status}`;
}
