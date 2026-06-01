import type { HttpClient } from "../http.js";
import type { QueryOf, ResultOf } from "../types.js";

export class Providers {
  constructor(private readonly http: HttpClient) {}

  /** List available LLM providers. */
  listLLMs() {
    return this.http.request<ResultOf<"listLLMProviders">>("GET", "/providers/llms");
  }

  /** List available voices, with optional provider/language/accent filters. */
  listVoices(query?: QueryOf<"listVoices">) {
    return this.http.request<ResultOf<"listVoices">>("GET", "/providers/voices", { query });
  }

  /** List available speech-to-text providers. */
  listSTT() {
    return this.http.request<ResultOf<"listSTTProviders">>("GET", "/providers/stt");
  }

  /** List available text-to-speech providers. */
  listTTS() {
    return this.http.request<ResultOf<"listTTSProviders">>("GET", "/providers/tts");
  }

  /** List all providers across categories. */
  listAll() {
    return this.http.request<ResultOf<"listAllProviders">>("GET", "/providers/all");
  }

  /** Retrieve details for a single voice. */
  getVoice(voiceId: number | string) {
    return this.http.request<ResultOf<"getVoice">>("GET", `/providers/voice/${voiceId}`);
  }
}
