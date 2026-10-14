import type { HttpClient } from "../http.js";
import type { BodyOf, QueryOf, ResultOf } from "../types.js";

/**
 * Voice cloning. Creation is asynchronous: `createClonedVoice` returns at
 * once with a voice in a pending state, then you poll `getClonedVoice` until
 * it is ready. Cloning must be included in your plan.
 */
export class Voices {
  constructor(private readonly http: HttpClient) {}

  /** List the cloned voices on your account. */
  listClonedVoices(query?: QueryOf<"listClonedVoices">) {
    return this.http.request<ResultOf<"listClonedVoices">>("GET", "/voices", { query });
  }

  /**
   * Clone a voice from an audio sample. Pass an idempotency key to make a
   * retry safe. The voice is not usable until its status is ready.
   */
  createClonedVoice(body: BodyOf<"createClonedVoice">, idempotencyKey?: string) {
    return this.http.request<ResultOf<"createClonedVoice">>("POST", "/voices", {
      body,
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    });
  }

  /** Retrieve one cloned voice, including its status. */
  getClonedVoice(voiceId: number | string) {
    return this.http.request<ResultOf<"getClonedVoice">>("GET", `/voices/${voiceId}`);
  }

  /** Update a cloned voice. */
  updateClonedVoice(voiceId: number | string, body: BodyOf<"updateClonedVoice">) {
    return this.http.request<ResultOf<"updateClonedVoice">>("PATCH", `/voices/${voiceId}`, { body });
  }

  /** Delete a cloned voice. */
  deleteClonedVoice(voiceId: number | string) {
    return this.http.request<ResultOf<"deleteClonedVoice">>("DELETE", `/voices/${voiceId}`);
  }

  /** Fetch the sample audio for a cloned voice. */
  getClonedVoiceSample(voiceId: number | string) {
    return this.http.request<ResultOf<"getClonedVoiceSample">>("GET", `/voices/${voiceId}/sample`);
  }

  /** Ask for the sample audio to be regenerated. */
  regenerateClonedVoiceSample(voiceId: number | string) {
    return this.http.request<ResultOf<"regenerateClonedVoiceSample">>("POST", `/voices/${voiceId}/sample`);
  }
}
