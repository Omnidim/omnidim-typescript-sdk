/** Thrown when the API returns a non-2xx response or the request fails. */
export class OmniDimensionError extends Error {
  /** HTTP status code, or 0 for network/transport errors. */
  readonly status: number;
  /** Parsed JSON error body, when the response had one. */
  readonly body: unknown;

  /** The server's id for this request. Quote it to support. Never made up here. */
  readonly requestId: string | undefined;

  constructor(status: number, message: string, body?: unknown, requestId?: string) {
    super(requestId ? `${message} (request id: ${requestId})` : message);
    this.requestId = requestId;
    this.name = "OmniDimensionError";
    this.status = status;
    this.body = body;
    Object.setPrototypeOf(this, OmniDimensionError.prototype);
  }
}
