import type { HttpClient } from "../http.js";

// These endpoints are not yet part of the published OpenAPI spec, so their
// types are maintained here by hand rather than generated. The shapes below
// match the live API. When the endpoints are added to the spec, these can be
// replaced with generated types like the other resources.

export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** A header sent with every request the integration makes. */
export interface IntegrationHeader {
  key: string;
  value: string;
}

/** A query or body parameter the agent can fill when calling the integration. */
export interface IntegrationParam {
  key: string;
  description?: string;
  type?: "string" | "number" | "boolean";
  required?: boolean;
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
  list() {
    return this.http.request<IntegrationListResponse>("GET", "/integrations");
  }

  /** List the integrations attached to an agent. */
  listForAgent(agentId: number | string) {
    return this.http.request<IntegrationListResponse>("GET", `/agents/${agentId}/integrations`);
  }

  /** Create a custom REST API integration. */
  createCustomApi(input: CustomApiIntegrationInput) {
    return this.http.request<IntegrationMutationResponse>("POST", "/integrations/custom-api", {
      body: { integration_type: "custom_api", ...input },
    });
  }

  /** Create a Cal.com scheduling integration. */
  createCal(input: CalIntegrationInput) {
    return this.http.request<IntegrationMutationResponse>("POST", "/integrations/cal", {
      body: { integration_type: "cal", ...input },
    });
  }

  /** Attach an existing integration to an agent. */
  addToAgent(agentId: number | string, integrationId: number) {
    return this.http.request<IntegrationMutationResponse>("POST", `/agents/${agentId}/integrations`, {
      body: { integration_id: integrationId },
    });
  }

  /** Remove an integration from an agent. */
  removeFromAgent(agentId: number | string, integrationId: number) {
    return this.http.request<IntegrationMutationResponse>(
      "DELETE",
      `/agents/${agentId}/integrations/${integrationId}`,
    );
  }
}
