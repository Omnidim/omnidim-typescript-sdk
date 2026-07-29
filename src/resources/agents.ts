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

  /** List an agent's saved config versions, newest first. */
  listVersions(agentId: number | string, query?: QueryOf<"listAgentVersions">) {
    return this.http.request<ResultOf<"listAgentVersions">>(
      "GET",
      `/agents/${agentId}/versions`,
      { query },
    );
  }

  /** Save the agent's current configuration as a named version. */
  saveVersion(agentId: number | string, body: BodyOf<"createAgentVersion">) {
    return this.http.request<ResultOf<"createAgentVersion">>(
      "POST",
      `/agents/${agentId}/versions`,
      { body },
    );
  }

  /**
   * What changed for a version. By default compares with the previous version
   * (what changed in it); pass `against: "current"` for what restoring it would
   * change, or a version number to compare with that version.
   */
  diffVersion(
    agentId: number | string,
    versionNumber: number | string,
    query?: QueryOf<"diffAgentVersion">,
  ) {
    return this.http.request<ResultOf<"diffAgentVersion">>(
      "GET",
      `/agents/${agentId}/versions/${versionNumber}/diff`,
      { query },
    );
  }

  /** Restore a version onto the live agent (saves the current state first). */
  restoreVersion(agentId: number | string, versionNumber: number | string) {
    return this.http.request<ResultOf<"restoreAgentVersion">>(
      "POST",
      `/agents/${agentId}/versions/${versionNumber}/restore`,
    );
  }

  /** Rename a version (name/note only). */
  renameVersion(
    agentId: number | string,
    versionNumber: number | string,
    body: BodyOf<"renameAgentVersion">,
  ) {
    return this.http.request<ResultOf<"renameAgentVersion">>(
      "PATCH",
      `/agents/${agentId}/versions/${versionNumber}`,
      { body },
    );
  }

  /** Delete a saved version. */
  deleteVersion(agentId: number | string, versionNumber: number | string) {
    return this.http.request<ResultOf<"deleteAgentVersion">>(
      "DELETE",
      `/agents/${agentId}/versions/${versionNumber}`,
    );
  }
}
