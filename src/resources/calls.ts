import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

export class Calls {
  constructor(private readonly http: HttpClient) {}

  /** Dispatch a single outbound call from an agent. */
  dispatch(body: BodyOf<"dispatchCall">) {
    return this.http.request<ResultOf<"dispatchCall">>("POST", "/calls/dispatch", { body });
  }

  /** List call logs, with pagination and optional filters. */
  listLogs(query?: QueryOf<"listCallLogs">) {
    return this.http.request<ResultOf<"listCallLogs">>("GET", "/calls/logs", { query });
  }

  /** Retrieve a single call log, including the transcript. */
  getLog(callLogId: number | string) {
    return this.http.request<ResultOf<"getCallLog">>("GET", `/calls/logs/${callLogId}`);
  }
}
