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

  /** Results for a campaign, one row per dialled contact. */
  listLines(bulkCallId: number | string, query?: QueryOf<"listBulkCallLines">) {
    return this.http.request<ResultOf<"listBulkCallLines">>(
      "GET",
      `/calls/bulk_call/${bulkCallId}/lines`,
      { query },
    );
  }

  /** Start a campaign that was created as a draft. */
  start(bulkCallId: number | string) {
    return this.http.request<ResultOf<"startBulkCall">>(
      "POST",
      `/calls/bulk_call/${bulkCallId}/start`,
    );
  }

  /** Add one contact to a running dynamic campaign. */
  addContact(campaignId: number | string, body: BodyOf<"addBulkCallContact">) {
    return this.http.request<ResultOf<"addBulkCallContact">>(
      "POST",
      `/calls/bulk_call/${campaignId}/add_contact`,
      { body },
    );
  }

  /** Add contacts to a running dynamic campaign in one call. */
  addContacts(campaignId: number | string, body: BodyOf<"addBulkCallContacts">) {
    return this.http.request<ResultOf<"addBulkCallContacts">>(
      "POST",
      `/calls/bulk_call/${campaignId}/add_contacts`,
      { body },
    );
  }

  /** Change how many calls the campaign runs at once. */
  setConcurrency(bulkCallId: number | string, body: BodyOf<"setBulkCallConcurrency">) {
    return this.http.request<ResultOf<"setBulkCallConcurrency">>(
      "PUT",
      `/calls/bulk_call/${bulkCallId}/concurrency`,
      { body },
    );
  }

  /** Set the hours during which the campaign is allowed to dial. */
  setDailyTimeControl(
    bulkCallId: number | string,
    body: BodyOf<"setBulkCallDailyTimeControl">,
  ) {
    return this.http.request<ResultOf<"setBulkCallDailyTimeControl">>(
      "PUT",
      `/calls/bulk_call/${bulkCallId}/daily-time-control`,
      { body },
    );
  }

  /** Retry contacts that did not connect. */
  retry(bulkCallId: number | string, body?: BodyOf<"retryBulkCall">) {
    return this.http.request<ResultOf<"retryBulkCall">>(
      "POST",
      `/calls/bulk_call/${bulkCallId}/manual_retry`,
      { body },
    );
  }

  /** The numbers this campaign rotates through when placing calls. */
  listNumbers(bulkCallId: number | string) {
    return this.http.request<ResultOf<"listBulkCallNumbers">>(
      "GET",
      `/calls/bulk_call/${bulkCallId}/numbers`,
    );
  }

  /** Add a purchased number to the campaign's rotation pool. */
  addNumber(bulkCallId: number | string, body: BodyOf<"addBulkCallNumber">) {
    return this.http.request<ResultOf<"addBulkCallNumber">>(
      "POST",
      `/calls/bulk_call/${bulkCallId}/numbers`,
      { body },
    );
  }

  /** Pause or resume one number in the rotation pool. */
  setNumberActive(
    bulkCallId: number | string,
    assignmentId: number | string,
    body: BodyOf<"setBulkCallNumberActive">,
  ) {
    return this.http.request<ResultOf<"setBulkCallNumberActive">>(
      "PUT",
      `/calls/bulk_call/${bulkCallId}/numbers/${assignmentId}`,
      { body },
    );
  }
}
