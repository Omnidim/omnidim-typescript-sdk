import type { components, operations } from "./generated/types.js";

/** Raw OpenAPI artifacts, re-exported for advanced use. */
export type { components, operations, paths } from "./generated/types.js";

/** All named schemas from the OpenAPI spec. */
export type Schemas = components["schemas"];

// Friendly aliases for the schemas developers reach for most.
export type Agent = Schemas["Agent"];
export type Call = Schemas["Call"];
export type BulkCallSummary = Schemas["BulkCallSummary"];
export type BulkCallDetail = Schemas["BulkCallDetail"];
export type KnowledgeBaseFile = Schemas["KnowledgeBaseFile"];
export type PhoneNumber = Schemas["PhoneNumber"];
export type Provider = Schemas["Provider"];
export type Voice = Schemas["Voice"];
export type VoiceDetail = Schemas["VoiceDetail"];
export type Simulation = Schemas["Simulation"];
export type Pagination = Schemas["Pagination"];

type Op = operations;

/** Query parameters for an operation, or `never` if it takes none. */
export type QueryOf<K extends keyof Op> = Op[K] extends {
  parameters: { query?: infer Q };
}
  ? NonNullable<Q>
  : never;

/** JSON request body for an operation, or `never` if it takes none. */
export type BodyOf<K extends keyof Op> = Op[K] extends {
  requestBody?: { content: { "application/json": infer B } };
}
  ? B
  : never;

/** JSON body of the success (2xx) response for an operation. */
export type ResultOf<K extends keyof Op> = Op[K]["responses"] extends infer R
  ? R extends { 200: { content: { "application/json": infer T } } }
    ? T
    : R extends { 201: { content: { "application/json": infer T } } }
      ? T
      : unknown
  : unknown;
