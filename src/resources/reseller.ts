import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

/**
 * Reseller (partner) operations. These require partner-level credentials;
 * non-reseller keys receive a 403.
 */
export class Reseller {
  constructor(private readonly http: HttpClient) {}

  /** List child organizations. */
  listOrganizations(query?: QueryOf<"listChildOrganizations">) {
    return this.http.request<ResultOf<"listChildOrganizations">>("GET", "/reseller/organizations", { query });
  }

  /** Add a user to a child organization. */
  addUser(body: BodyOf<"addUser">) {
    return this.http.request<ResultOf<"addUser">>("POST", "/reseller/users/add", { body });
  }

  /** Set a user's access control. */
  setUserAccessControl(body: BodyOf<"setUserAccessControl">) {
    return this.http.request<ResultOf<"setUserAccessControl">>("POST", "/reseller/users/access-control", { body });
  }

  /** Set a user's expiry. */
  setUserExpiry(body: BodyOf<"setUserExpiry">) {
    return this.http.request<ResultOf<"setUserExpiry">>("POST", "/reseller/users/expiry", { body });
  }

  /** Set a child organization's concurrency. */
  setConcurrency(body: BodyOf<"setChildConcurrency">) {
    return this.http.request<ResultOf<"setChildConcurrency">>("POST", "/reseller/concurrency", { body });
  }

  /** Calculate the cost of a credit operation. */
  calculateCredits(body: BodyOf<"calculateCreditOperation">) {
    return this.http.request<ResultOf<"calculateCreditOperation">>("POST", "/reseller/credits/calculate", { body });
  }

  /** Transfer credits to a child organization. */
  transferCredits(body: BodyOf<"transferCreditsToChild">) {
    return this.http.request<ResultOf<"transferCreditsToChild">>("POST", "/reseller/credits/transfer", { body });
  }

  /** Revert credits from a child organization. */
  revertCredits(body: BodyOf<"revertCreditsFromChild">) {
    return this.http.request<ResultOf<"revertCreditsFromChild">>("POST", "/reseller/credits/revert", { body });
  }

  /** Retrieve reseller credit logs. */
  creditLogs(query?: QueryOf<"getResellerCreditLogs">) {
    return this.http.request<ResultOf<"getResellerCreditLogs">>("GET", "/reseller/credits/logs", { query });
  }
}
