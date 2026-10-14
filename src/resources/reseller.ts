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

  /**
   * Block or restore a client, reversibly. Nothing is deleted.
   *
   * Send `blocked` and exactly one of `user_id` or `organization_id`.
   * `detach_numbers` only applies to an organization block.
   */
  setClientAccess(body: BodyOf<"setClientAccess">) {
    return this.http.request<ResultOf<"setClientAccess">>("POST", "/reseller/users/access", { body });
  }

  /**
   * What releasing a client would do, changing nothing. Call it before
   * `releaseClient`. A release is refused while `has_live_subscription` is
   * true.
   */
  previewClientRelease(query: QueryOf<"previewClientRelease">) {
    return this.http.request<ResultOf<"previewClientRelease">>(
      "GET",
      "/reseller/clients/release-preview",
      { query },
    );
  }

  /**
   * Release a client for good. One-way: unlike `setClientAccess`, it cannot be
   * undone. It reverts the balance you funded, detaches the client's numbers,
   * takes back the ones you bought, and retires its logins.
   */
  releaseClient(body: BodyOf<"releaseClient">) {
    return this.http.request<ResultOf<"releaseClient">>("POST", "/reseller/clients/release", { body });
  }

  /**
   * Issue an API key for a user in one of your client organizations. The
   * secret is in this response only; store it now, because no listing shows it
   * again.
   */
  issueChildApiKey(body: BodyOf<"issueChildApiKey">) {
    return this.http.request<ResultOf<"issueChildApiKey">>("POST", "/reseller/users/api-keys", { body });
  }

  /**
   * Revoke a client's API key. Pass the key's `api_key_id`, or `0` for the
   * default key every account gets at signup. The key stops working on the
   * next request.
   */
  revokeChildApiKey(body: BodyOf<"revokeChildApiKey">) {
    return this.http.request<ResultOf<"revokeChildApiKey">>("POST", "/reseller/users/api-keys/revoke", { body });
  }

  /** Read your brand and custom email server settings. */
  getIdentity() {
    return this.http.request<ResultOf<"getResellerIdentity">>("GET", "/reseller/identity");
  }

  /** Set the brand your client organizations see. The first save creates it. */
  saveIdentity(body: BodyOf<"saveResellerIdentity">) {
    return this.http.request<ResultOf<"saveResellerIdentity">>("POST", "/reseller/identity/save", { body });
  }

  /**
   * Send your clients' emails through your own email server. The login is
   * checked before it is saved. Save your brand first.
   */
  saveIdentitySmtp(body: BodyOf<"saveResellerIdentitySmtp">) {
    return this.http.request<ResultOf<"saveResellerIdentitySmtp">>("POST", "/reseller/identity/smtp/save", { body });
  }

  /** Check a login to an email server. Nothing is saved. */
  testIdentitySmtp(body: BodyOf<"testResellerIdentitySmtp">) {
    return this.http.request<ResultOf<"testResellerIdentitySmtp">>("POST", "/reseller/identity/smtp/test", { body });
  }

  /** Send your clients' emails back to the default sender. The saved server is kept. */
  disableIdentitySmtp() {
    return this.http.request<ResultOf<"disableResellerIdentitySmtp">>("POST", "/reseller/identity/smtp/disable");
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
   * On a `redirect` step, pass `return_url` to bring your client back to a page
   * in your own app. An `upload` step takes a file: use `uploadKycDocument`.
   */
  submitKycStep(step: string, body: BodyOf<"submitResellerKycStep">) {
    return this.http.request<ResultOf<"submitResellerKycStep">>(
      "POST",
      `/reseller/kyc/steps/${encodeURIComponent(step)}`,
      { body },
    );
  }

  /**
   * Upload the document for a step whose `method` is `upload`, such as the PAN
   * card after PAN verification. `next_step` names the upload step when one is
   * due, and `kycRequirements` lists the accepted formats and size limit.
   *
   * @param document The file, as a Blob or File, or its raw bytes.
   * @param filename Sent with the file, including its extension.
   */
  uploadKycDocument(
    step: string,
    fields: KycDocumentFields,
    document: Blob | Uint8Array | ArrayBuffer,
    filename: string,
  ) {
    const form = new FormData();
    form.append("user_id", String(fields.user_id));
    form.append("region", fields.region);
    if (fields.carrier !== undefined) form.append("carrier", fields.carrier);
    const file = document instanceof Blob ? document : new Blob([document as BlobPart]);
    form.append("document", file, filename);
    return this.http.request<ResultOf<"submitResellerKycStep">>(
      "POST",
      `/reseller/kyc/steps/${encodeURIComponent(step)}`,
      { body: form },
    );
  }
}

/** The fields sent beside a KYC document upload. */
export interface KycDocumentFields {
  user_id: number;
  region: string;
  carrier?: string;
}
