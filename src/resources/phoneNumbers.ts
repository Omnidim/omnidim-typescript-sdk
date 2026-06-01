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
}
