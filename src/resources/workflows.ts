import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

export class Workflows {
  constructor(private readonly http: HttpClient) {}

  /** List the node types a workflow can use. */
  listNodeTypes(query?: QueryOf<"listWorkflowNodeTypes">) {
    return this.http.request<ResultOf<"listWorkflowNodeTypes">>("GET", "/workflow-node-types", { query });
  }

  /** Retrieve one node type, with its config fields. */
  getNodeType(nodeType: string, query?: QueryOf<"getWorkflowNodeType">) {
    return this.http.request<ResultOf<"getWorkflowNodeType">>(
      "GET",
      `/workflow-node-types/${encodeURIComponent(nodeType)}`,
      { query },
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
  create(body: BodyOf<"createWorkflow">, query?: QueryOf<"createWorkflow">) {
    return this.http.request<ResultOf<"createWorkflow">>("POST", "/workflows", { body, query });
  }

  /** Retrieve a single workflow. */
  get(workflowId: number | string, query?: QueryOf<"getWorkflow">) {
    return this.http.request<ResultOf<"getWorkflow">>("GET", `/workflows/${workflowId}`, { query });
  }

  /** Edit a workflow. The body must carry the current `revision`. */
  edit(workflowId: number | string, body: BodyOf<"editWorkflow">, query?: QueryOf<"editWorkflow">) {
    return this.http.request<ResultOf<"editWorkflow">>("PATCH", `/workflows/${workflowId}`, { body, query });
  }

  /** Delete a workflow. */
  delete(workflowId: number | string, query?: QueryOf<"deleteWorkflow">) {
    return this.http.request<ResultOf<"deleteWorkflow">>("DELETE", `/workflows/${workflowId}`, { query });
  }

  /** Check a workflow for errors without publishing it. */
  validate(workflowId: number | string, query?: QueryOf<"validateWorkflow">) {
    return this.http.request<ResultOf<"validateWorkflow">>("POST", `/workflows/${workflowId}/validate`, { query });
  }

  /** Publish the current draft of a workflow. */
  publish(workflowId: number | string, query?: QueryOf<"publishWorkflow">) {
    return this.http.request<ResultOf<"publishWorkflow">>("POST", `/workflows/${workflowId}/publish`, { query });
  }

  /** Turn a published workflow on. */
  activate(workflowId: number | string, query?: QueryOf<"activateWorkflow">) {
    return this.http.request<ResultOf<"activateWorkflow">>("POST", `/workflows/${workflowId}/activate`, { query });
  }

  /** Turn a workflow off. */
  deactivate(workflowId: number | string, query?: QueryOf<"deactivateWorkflow">) {
    return this.http.request<ResultOf<"deactivateWorkflow">>("POST", `/workflows/${workflowId}/deactivate`, { query });
  }

  /** Run a workflow once as a test. */
  test(workflowId: number | string, body?: BodyOf<"testWorkflow">, query?: QueryOf<"testWorkflow">) {
    return this.http.request<ResultOf<"testWorkflow">>("POST", `/workflows/${workflowId}/test`, { body, query });
  }

  /** Retrieve one execution of a workflow. */
  getExecution(
    workflowId: number | string,
    executionId: number | string,
    query?: QueryOf<"getWorkflowExecution">,
  ) {
    return this.http.request<ResultOf<"getWorkflowExecution">>(
      "GET",
      `/workflows/${workflowId}/executions/${executionId}`,
      { query },
    );
  }
}
