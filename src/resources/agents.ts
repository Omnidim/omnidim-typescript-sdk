import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

export class Agents {
  constructor(private readonly http: HttpClient) {}

  /** List agents for the authenticated user, with pagination. */
  list(query?: QueryOf<"listAgents">) {
    return this.http.request<ResultOf<"listAgents">>("GET", "/agents", { query });
  }

  /** Create a new agent. */
  create(body: BodyOf<"createAgent">) {
    return this.http.request<ResultOf<"createAgent">>("POST", "/agents/create", { body });
  }

  /** Retrieve a single agent by id. */
  get(agentId: number | string) {
    return this.http.request<ResultOf<"getAgent">>("GET", `/agents/${agentId}`);
  }

  /** Update an agent's configuration. */
  update(agentId: number | string, body: BodyOf<"updateAgent">) {
    return this.http.request<ResultOf<"updateAgent">>("PUT", `/agents/${agentId}`, { body });
  }

  /** Delete an agent. */
  delete(agentId: number | string) {
    return this.http.request<ResultOf<"deleteAgent">>("DELETE", `/agents/${agentId}`);
  }
}
