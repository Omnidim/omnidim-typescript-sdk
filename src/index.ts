import { HttpClient, type ClientOptions } from "./http.js";
import { Agents } from "./resources/agents.js";
import { Calls } from "./resources/calls.js";
import { BulkCalls } from "./resources/bulkCalls.js";
import { KnowledgeBase } from "./resources/knowledgeBase.js";
import { PhoneNumbers } from "./resources/phoneNumbers.js";
import { Providers } from "./resources/providers.js";
import { Reseller } from "./resources/reseller.js";
import { Integrations } from "./resources/integrations.js";

export { OmniDimensionError } from "./errors.js";
export type { ClientOptions } from "./http.js";
export * from "./types.js";
export type {
  Integration,
  IntegrationHeader,
  IntegrationParam,
  CustomApiIntegrationInput,
  CalIntegrationInput,
  IntegrationListResponse,
  IntegrationMutationResponse,
} from "./resources/integrations.js";

/**
 * The OmniDimension API client.
 *
 * ```ts
 * import OmniDimension from "@omnidim-ai/sdk";
 *
 * const client = new OmniDimension({ apiKey: process.env.OMNIDIM_API_KEY! });
 * const { bots } = await client.agents.list();
 * ```
 */
export class OmniDimension {
  readonly agents: Agents;
  readonly calls: Calls;
  readonly bulkCalls: BulkCalls;
  readonly knowledgeBase: KnowledgeBase;
  readonly phoneNumbers: PhoneNumbers;
  readonly providers: Providers;
  readonly reseller: Reseller;
  readonly integrations: Integrations;

  constructor(options: ClientOptions) {
    const http = new HttpClient(options);
    this.agents = new Agents(http);
    this.calls = new Calls(http);
    this.bulkCalls = new BulkCalls(http);
    this.knowledgeBase = new KnowledgeBase(http);
    this.phoneNumbers = new PhoneNumbers(http);
    this.providers = new Providers(http);
    this.reseller = new Reseller(http);
    this.integrations = new Integrations(http);
  }
}

export default OmniDimension;
