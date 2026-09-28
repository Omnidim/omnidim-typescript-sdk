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

  /**
   * Verification status for a client, one entry per carrier.
   *
   * Not one per region: verification is per carrier, so a client verified on
   * one carrier of a region still has to verify on the other before it can
   * buy there. Match on `carrier`, and pass that same name to the steps and
   * to the purchase.
   */
  kycStatus(query: QueryOf<"getResellerKycStatus">) {
    return this.http.request<ResultOf<"getResellerKycStatus">>("GET", "/reseller/kyc/status", { query });
  }

  /**
   * The verification steps a carrier runs, in order, with the fields each one
   * needs and how it is performed.
   *
   * Read this rather than hard-coding a sequence: carriers in the same region
   * do not share a step list.
   */
  kycRequirements(query: QueryOf<"getResellerKycRequirements">) {
    return this.http.request<ResultOf<"getResellerKycRequirements">>(
      "GET",
      "/reseller/kyc/requirements",
      { query },
    );
  }

  /**
   * Run one verification step. Follow `next_step` from each response until
   * there is none left, and branch on `method` rather than on the step's name.
   */
  submitKycStep(step: string, body: BodyOf<"submitResellerKycStep">) {
    return this.http.request<ResultOf<"submitResellerKycStep">>(
      "POST",
      `/reseller/kyc/steps/${encodeURIComponent(step)}`,
      { body },
    );
  }
}
