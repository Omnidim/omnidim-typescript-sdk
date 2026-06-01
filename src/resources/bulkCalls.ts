import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

export class BulkCalls {
  constructor(private readonly http: HttpClient) {}

  /** List bulk-call campaigns, with pagination and optional status filter. */
  list(query?: QueryOf<"fetchBulkCalls">) {
    return this.http.request<ResultOf<"fetchBulkCalls">>("GET", "/calls/bulk_call", { query });
  }

  /** Create a bulk-call campaign. */
  create(body: BodyOf<"createBulkCall">) {
    return this.http.request<ResultOf<"createBulkCall">>("POST", "/calls/bulk_call/create", { body });
  }

  /** Retrieve a single bulk-call campaign. */
  get(bulkCallId: number | string) {
    return this.http.request<ResultOf<"getBulkCall">>("GET", `/calls/bulk_call/${bulkCallId}`);
  }

  /** Apply an action (pause, resume, reschedule) to a campaign. */
  action(bulkCallId: number | string, body: BodyOf<"bulkCallActions">) {
    return this.http.request<ResultOf<"bulkCallActions">>("PUT", `/calls/bulk_call/${bulkCallId}`, { body });
  }

  /** Cancel a bulk-call campaign. */
  cancel(bulkCallId: number | string) {
    return this.http.request<ResultOf<"cancelBulkCall">>("DELETE", `/calls/bulk_call/${bulkCallId}`);
  }

  /** Live status of a running bulk-call campaign. */
  liveStatus(bulkCallId: number | string) {
    return this.http.request<ResultOf<"getBulkCallLiveStatus">>(
      "GET",
      `/bulk-call/${bulkCallId}/live-status`,
    );
  }
}
