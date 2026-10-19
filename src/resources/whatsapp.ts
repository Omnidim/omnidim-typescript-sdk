import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

type Id = number | string;

/**
 * The WhatsApp API: numbers, templates, calling, conversations, messages,
 * media, opt-outs and broadcast campaigns. Sending a message and launching a
 * campaign require an idempotency key, so a retry never sends twice.
 */
export class WhatsApp {
  constructor(private readonly http: HttpClient) {}

  // ---- numbers ----

  /** List your WhatsApp numbers with their health and quality rating. */
  listNumbers(query?: QueryOf<"listWhatsappNumbers">) {
    return this.http.request<ResultOf<"listWhatsappNumbers">>("GET", "/whatsapp/numbers", { query });
  }

  /** List the numbers on a Meta WhatsApp Business account, with their health. Nothing is imported. */
  previewNumbers(body: BodyOf<"previewWhatsappNumbers">) {
    return this.http.request<ResultOf<"previewWhatsappNumbers">>("POST", "/whatsapp/numbers/preview", { body });
  }

  /** Connect numbers from a Meta WhatsApp Business account. Importing again updates the token. */
  importNumbers(body: BodyOf<"importWhatsappNumbers">) {
    return this.http.request<ResultOf<"importWhatsappNumbers">>("POST", "/whatsapp/numbers", { body });
  }

  /** Retrieve one WhatsApp number. */
  getNumber(numberId: Id) {
    return this.http.request<ResultOf<"getWhatsappNumber">>("GET", `/whatsapp/numbers/${numberId}`);
  }

  /** List a number's message templates. */
  listTemplates(numberId: Id, query?: QueryOf<"listWhatsappTemplates">) {
    return this.http.request<ResultOf<"listWhatsappTemplates">>("GET", `/whatsapp/numbers/${numberId}/templates`, {
      query,
    });
  }

  /** Pull the number's templates and their review statuses from WhatsApp. */
  syncTemplates(numberId: Id) {
    return this.http.request<ResultOf<"syncWhatsappTemplates">>(
      "POST",
      `/whatsapp/numbers/${numberId}/templates/sync`,
    );
  }

  /** Read whether WhatsApp calling is on for a number. */
  getCalling(numberId: Id) {
    return this.http.request<ResultOf<"getWhatsappCalling">>("GET", `/whatsapp/numbers/${numberId}/calling`);
  }

  /** Turn WhatsApp calling on or off for a number. */
  setCalling(numberId: Id, body: BodyOf<"setWhatsappCalling">) {
    return this.http.request<ResultOf<"setWhatsappCalling">>("PATCH", `/whatsapp/numbers/${numberId}/calling`, {
      body,
    });
  }

  // ---- conversations and messages ----

  /** List a number's conversations. Pass `updated_since` to poll for changes. */
  listConversations(numberId: Id, query?: QueryOf<"listWhatsappConversations">) {
    return this.http.request<ResultOf<"listWhatsappConversations">>(
      "GET",
      `/whatsapp/numbers/${numberId}/conversations`,
      { query },
    );
  }

  /** Retrieve one conversation, including whether its 24-hour window is open. */
  getConversation(conversationId: Id) {
    return this.http.request<ResultOf<"getWhatsappConversation">>("GET", `/whatsapp/conversations/${conversationId}`);
  }

  /** Stop the agent replying so a person can answer. */
  takeOverConversation(conversationId: Id) {
    return this.http.request<ResultOf<"takeOverWhatsappConversation">>(
      "POST",
      `/whatsapp/conversations/${conversationId}/take_over`,
    );
  }

  /** Let the agent reply again. */
  handBackConversation(conversationId: Id) {
    return this.http.request<ResultOf<"handBackWhatsappConversation">>(
      "POST",
      `/whatsapp/conversations/${conversationId}/hand_back`,
    );
  }

  /** List a conversation's messages. Pass `after` to read only newer ones. */
  listMessages(query: QueryOf<"listWhatsappMessages">) {
    return this.http.request<ResultOf<"listWhatsappMessages">>("GET", "/whatsapp/messages", { query });
  }

  /** Send a message. A retry with the same idempotency key and body sends nothing new. */
  sendMessage(body: BodyOf<"sendWhatsappMessage">, idempotencyKey: string) {
    return this.http.request<ResultOf<"sendWhatsappMessage">>("POST", "/whatsapp/messages", {
      body,
      headers: { "Idempotency-Key": idempotencyKey },
    });
  }

  /** Retrieve one message with its delivery and read timeline. */
  getMessage(messageId: Id) {
    return this.http.request<ResultOf<"getWhatsappMessage">>("GET", `/whatsapp/messages/${messageId}`);
  }

  /** Upload a file to send in a message. */
  uploadMedia(phoneNumberId: Id, type: string, file: Blob, filename?: string) {
    const form = new FormData();
    form.append("phone_number_id", String(phoneNumberId));
    form.append("type", type);
    form.append("file", file, filename);
    return this.http.request<ResultOf<"uploadWhatsappMedia">>("POST", "/whatsapp/media", { body: form });
  }

  // ---- opt-outs ----

  /** List the customers blocked from receiving messages on a number. */
  listOptOuts(numberId: Id, query?: QueryOf<"listWhatsappOptOuts">) {
    return this.http.request<ResultOf<"listWhatsappOptOuts">>("GET", `/whatsapp/numbers/${numberId}/opt_outs`, {
      query,
    });
  }

  /** Block a customer from receiving messages on a number. */
  addOptOut(numberId: Id, body: BodyOf<"addWhatsappOptOut">) {
    return this.http.request<ResultOf<"addWhatsappOptOut">>("POST", `/whatsapp/numbers/${numberId}/opt_outs`, {
      body,
    });
  }

  /** Lift a block so the customer can receive messages again. */
  liftOptOut(numberId: Id, optOutId: Id) {
    return this.http.request<ResultOf<"liftWhatsappOptOut">>(
      "DELETE",
      `/whatsapp/numbers/${numberId}/opt_outs/${optOutId}`,
    );
  }

  // ---- campaigns ----

  /** List broadcast campaigns. */
  listCampaigns(query?: QueryOf<"listWhatsappCampaigns">) {
    return this.http.request<ResultOf<"listWhatsappCampaigns">>("GET", "/whatsapp/campaigns", { query });
  }

  /** Create a draft broadcast campaign. */
  createCampaign(body: BodyOf<"createWhatsappCampaign">) {
    return this.http.request<ResultOf<"createWhatsappCampaign">>("POST", "/whatsapp/campaigns", { body });
  }

  /** Retrieve one campaign with its delivery counts. */
  getCampaign(campaignId: Id) {
    return this.http.request<ResultOf<"getWhatsappCampaign">>("GET", `/whatsapp/campaigns/${campaignId}`);
  }

  /** List a campaign's contacts and what happened to each. */
  listCampaignContacts(campaignId: Id, query?: QueryOf<"listWhatsappCampaignContacts">) {
    return this.http.request<ResultOf<"listWhatsappCampaignContacts">>(
      "GET",
      `/whatsapp/campaigns/${campaignId}/contacts`,
      { query },
    );
  }

  /** Add one contact or up to 500. On a running campaign they are sent now. */
  addCampaignContacts(campaignId: Id, body: BodyOf<"addWhatsappCampaignContacts">) {
    return this.http.request<ResultOf<"addWhatsappCampaignContacts">>(
      "POST",
      `/whatsapp/campaigns/${campaignId}/contacts`,
      { body },
    );
  }

  /** Start a draft campaign. A retry with the same idempotency key does not start it twice. */
  launchCampaign(campaignId: Id, idempotencyKey: string) {
    return this.http.request<ResultOf<"launchWhatsappCampaign">>("POST", `/whatsapp/campaigns/${campaignId}/launch`, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
  }

  /** Pause a running campaign. */
  pauseCampaign(campaignId: Id) {
    return this.http.request<ResultOf<"pauseWhatsappCampaign">>("POST", `/whatsapp/campaigns/${campaignId}/pause`);
  }

  /** Resume a paused campaign. */
  resumeCampaign(campaignId: Id) {
    return this.http.request<ResultOf<"resumeWhatsappCampaign">>("POST", `/whatsapp/campaigns/${campaignId}/resume`);
  }

  /** Stop a campaign for good. Contacts not yet sent are not sent. */
  cancelCampaign(campaignId: Id) {
    return this.http.request<ResultOf<"cancelWhatsappCampaign">>("POST", `/whatsapp/campaigns/${campaignId}/cancel`);
  }
}
