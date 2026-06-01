import type { HttpClient } from "../http.js";
import type { BodyOf, ResultOf } from "../types.js";

export class KnowledgeBase {
  constructor(private readonly http: HttpClient) {}

  /** List knowledge-base files. */
  list() {
    return this.http.request<ResultOf<"listKnowledgeBaseFiles">>("GET", "/knowledge_base/list");
  }

  /** Check whether a file may be uploaded (size and type limits). */
  canUpload(body: BodyOf<"canUploadFile">) {
    return this.http.request<ResultOf<"canUploadFile">>("POST", "/knowledge_base/can_upload", { body });
  }

  /** Upload a knowledge-base file. */
  upload(body: BodyOf<"uploadKnowledgeBaseFile">) {
    return this.http.request<ResultOf<"uploadKnowledgeBaseFile">>("POST", "/knowledge_base/create", { body });
  }

  /** Attach files to an agent. */
  attach(body: BodyOf<"attachKnowledgeBaseFiles">) {
    return this.http.request<ResultOf<"attachKnowledgeBaseFiles">>("POST", "/knowledge_base/attach", { body });
  }

  /** Detach files from an agent. */
  detach(body: BodyOf<"detachKnowledgeBaseFiles">) {
    return this.http.request<ResultOf<"detachKnowledgeBaseFiles">>("POST", "/knowledge_base/detach", { body });
  }

  /** Delete a knowledge-base file. */
  delete(body: BodyOf<"deleteKnowledgeBaseFile">) {
    return this.http.request<ResultOf<"deleteKnowledgeBaseFile">>("POST", "/knowledge_base/delete", { body });
  }
}
