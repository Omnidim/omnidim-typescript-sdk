import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

export class Simulations {
  constructor(private readonly http: HttpClient) {}

  /** List simulations, with pagination. */
  list(query?: QueryOf<"listSimulations">) {
    return this.http.request<ResultOf<"listSimulations">>("GET", "/simulations", { query });
  }

  /** Create a simulation. */
  create(body: BodyOf<"createSimulation">) {
    return this.http.request<ResultOf<"createSimulation">>("POST", "/simulations", { body });
  }

  /** Retrieve a single simulation. */
  get(simulationId: number | string) {
    return this.http.request<ResultOf<"getSimulation">>("GET", `/simulations/${simulationId}`);
  }

  /** Update a simulation. */
  update(simulationId: number | string, body: BodyOf<"updateSimulation">) {
    return this.http.request<ResultOf<"updateSimulation">>("PUT", `/simulations/${simulationId}`, { body });
  }

  /** Delete a simulation. */
  delete(simulationId: number | string) {
    return this.http.request<ResultOf<"deleteSimulation">>("DELETE", `/simulations/${simulationId}`);
  }

  /** Start a simulation run. */
  start(simulationId: number | string) {
    return this.http.request<ResultOf<"startSimulation">>("POST", `/simulations/${simulationId}/start`);
  }

  /** Stop a running simulation. */
  stop(simulationId: number | string) {
    return this.http.request<ResultOf<"stopSimulation">>("POST", `/simulations/${simulationId}/stop`);
  }

  /** Enhance a simulation's prompt. */
  enhancePrompt(simulationId: number | string) {
    return this.http.request<ResultOf<"enhancePrompt">>("POST", `/simulations/${simulationId}/enhance-prompt`);
  }
}
