import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

export class PhoneNumbers {
  constructor(private readonly http: HttpClient) {}

  /** List phone numbers, with pagination. */
  list(query?: QueryOf<"listPhoneNumbers">) {
    return this.http.request<ResultOf<"listPhoneNumbers">>("GET", "/phone_number/list", { query });
  }

  /** Attach a phone number to an agent. */
  attach(body: BodyOf<"attachPhoneNumber">) {
    return this.http.request<ResultOf<"attachPhoneNumber">>("POST", "/phone_number/attach", { body });
  }

  /** Detach a phone number from its agent. */
  detach(body: BodyOf<"detachPhoneNumber">) {
    return this.http.request<ResultOf<"detachPhoneNumber">>("POST", "/phone_number/detach", { body });
  }

  /** Import a number from Twilio. */
  importTwilio(body: BodyOf<"importTwilioNumber">) {
    return this.http.request<ResultOf<"importTwilioNumber">>("POST", "/phone_number/import/twilio", { body });
  }

  /** Import a number from Exotel. */
  importExotel(body: BodyOf<"importExotelNumber">) {
    return this.http.request<ResultOf<"importExotelNumber">>("POST", "/phone_number/import/exotel", { body });
  }

  /** Import a number over a SIP trunk. */
  importSip(body: BodyOf<"importSipTrunk">) {
    return this.http.request<ResultOf<"importSipTrunk">>("POST", "/phone_number/import/sip", { body });
  }

  /** Search numbers available to purchase in a region. */
  search(query?: QueryOf<"searchPhoneNumbers">) {
    return this.http.request<ResultOf<"searchPhoneNumbers">>("GET", "/phone_number/search", { query });
  }

  /** Purchase a number. Pass an idempotency key to make a retry safe. */
  purchase(body: BodyOf<"purchasePhoneNumber">, idempotencyKey?: string) {
    return this.http.request<ResultOf<"purchasePhoneNumber">>("POST", "/phone_number/purchase", {
      body,
      // Same key replays the original order instead of charging twice.
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    });
  }

  /** Release a purchased number. */
  release(body: BodyOf<"releasePhoneNumber">) {
    return this.http.request<ResultOf<"releasePhoneNumber">>("POST", "/phone_number/release", { body });
  }
}
