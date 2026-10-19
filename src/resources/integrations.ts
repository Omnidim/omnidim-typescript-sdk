import type { HttpClient } from "../http.js";
import type { QueryOf, ResultOf } from "../types.js";

export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** A header sent with every request the integration makes. */
export interface IntegrationHeader {
  key: string;
  value: string;
}

/**
 * A query or body parameter. With `isLLMGenerated` true (the default) the agent
 * fills it from the conversation, guided by `description`. With it false, the
 * text in `description` is sent as a fixed value.
 */
export interface IntegrationParam {
  key: string;
  description?: string;
  type?: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  isLLMGenerated?: boolean;
  children?: IntegrationParam[];
}

export interface Integration {
  id: number;
  name: string;
  integration_type: string;
  description?: string;
  url?: string;
  method?: HttpVerb;
  headers?: IntegrationHeader[];
  query_params?: IntegrationParam[];
  body_params?: IntegrationParam[];
  stop_listening?: boolean;
  request_timeout?: number;
  pass_call_metadata?: boolean;
  [key: string]: unknown;
}

export interface CustomApiIntegrationInput {
  name: string;
  url: string;
  method: HttpVerb;
  description?: string;
  headers?: IntegrationHeader[];
  query_params?: IntegrationParam[];
  body_params?: IntegrationParam[];
  stop_listening?: boolean;
  request_timeout?: number;
}

export interface CalIntegrationInput {
  name: string;
  cal_api_key: string;
  cal_id: string;
  cal_timezone: string;
  description?: string;
}

export interface IntegrationListResponse {
  success: boolean;
  integrations: Integration[];
}

export interface IntegrationMutationResponse {
  success: boolean;
  [key: string]: unknown;
}

export class Integrations {
  constructor(private readonly http: HttpClient) {}

  /** List the integrations on the account. */
  list(query?: QueryOf<"listIntegrations">) {
    return this.http.request<ResultOf<"listIntegrations">>("GET", "/integrations", { query });
  }

  /** List the integrations attached to an agent. */
  listForAgent(agentId: number | string) {
    return this.http.request<ResultOf<"listAgentIntegrations">>("GET", `/agents/${agentId}/integrations`);
  }

  /** Create a custom REST API integration. */
  createCustomApi(input: CustomApiIntegrationInput) {
    return this.http.request<ResultOf<"createCustomApiIntegration">>("POST", "/integrations/custom-api", {
      body: { integration_type: "custom_api", ...input },
    });
  }

  /** Create a Cal.com scheduling integration. */
  createCal(input: CalIntegrationInput) {
    return this.http.request<ResultOf<"createCalIntegration">>("POST", "/integrations/cal", {
      body: { integration_type: "cal", ...input },
    });
  }

  /** Attach an existing integration to an agent. */
  addToAgent(agentId: number | string, integrationId: number) {
    return this.http.request<ResultOf<"attachAgentIntegration">>("POST", `/agents/${agentId}/integrations`, {
      body: { integration_id: integrationId },
    });
  }

  /** Remove an integration from an agent. */
  removeFromAgent(agentId: number | string, integrationId: number) {
    return this.http.request<ResultOf<"detachAgentIntegration">>(
      "DELETE",
      `/agents/${agentId}/integrations/${integrationId}`,
    );
  }
}
