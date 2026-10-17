import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

export class Workflows {
  constructor(private readonly http: HttpClient) {}

  /** List the node types a workflow can use. */
  listNodeTypes() {
    return this.http.request<ResultOf<"listWorkflowNodeTypes">>("GET", "/workflow-node-types");
  }

  /** Retrieve one node type, with its config fields. */
  getNodeType(nodeType: string) {
    return this.http.request<ResultOf<"getWorkflowNodeType">>(
      "GET",
      `/workflow-node-types/${encodeURIComponent(nodeType)}`,
    );
  }

  /** List the allowed values for one config field of a node type. */
  listFieldOptions(
    nodeType: string,
    field: string,
    query?: QueryOf<"listWorkflowFieldOptions">,
  ) {
    return this.http.request<ResultOf<"listWorkflowFieldOptions">>(
      "GET",
      `/workflow-node-types/${encodeURIComponent(nodeType)}/options/${encodeURIComponent(field)}`,
      { query },
    );
  }

  /** List workflows, with cursor pagination. */
  list(query?: QueryOf<"listWorkflows">) {
    return this.http.request<ResultOf<"listWorkflows">>("GET", "/workflows", { query });
  }

  /** Create a workflow. */
  create(body: BodyOf<"createWorkflow">) {
    return this.http.request<ResultOf<"createWorkflow">>("POST", "/workflows", { body });
  }

  /** Retrieve a single workflow. */
  get(workflowId: number | string) {
    return this.http.request<ResultOf<"getWorkflow">>("GET", `/workflows/${workflowId}`);
  }

  /** Edit a workflow. The body must carry the current `revision`. */
  edit(workflowId: number | string, body: BodyOf<"editWorkflow">) {
    return this.http.request<ResultOf<"editWorkflow">>("PATCH", `/workflows/${workflowId}`, { body });
  }

  /** Delete a workflow. */
  delete(workflowId: number | string) {
    return this.http.request<ResultOf<"deleteWorkflow">>("DELETE", `/workflows/${workflowId}`);
  }

  /** Check a workflow for errors without publishing it. */
  validate(workflowId: number | string) {
    return this.http.request<ResultOf<"validateWorkflow">>("POST", `/workflows/${workflowId}/validate`);
  }

  /** Publish the current draft of a workflow. */
  publish(workflowId: number | string) {
    return this.http.request<ResultOf<"publishWorkflow">>("POST", `/workflows/${workflowId}/publish`);
  }

  /** Turn a published workflow on. */
  activate(workflowId: number | string) {
    return this.http.request<ResultOf<"activateWorkflow">>("POST", `/workflows/${workflowId}/activate`);
  }

  /** Turn a workflow off. */
  deactivate(workflowId: number | string) {
    return this.http.request<ResultOf<"deactivateWorkflow">>("POST", `/workflows/${workflowId}/deactivate`);
  }

  /** Run a workflow once as a test. */
  test(workflowId: number | string, body?: BodyOf<"testWorkflow">) {
    return this.http.request<ResultOf<"testWorkflow">>("POST", `/workflows/${workflowId}/test`, { body });
  }

  /** Retrieve one execution of a workflow. */
  getExecution(workflowId: number | string, executionId: number | string) {
    return this.http.request<ResultOf<"getWorkflowExecution">>(
      "GET",
      `/workflows/${workflowId}/executions/${executionId}`,
    );
  }
}
