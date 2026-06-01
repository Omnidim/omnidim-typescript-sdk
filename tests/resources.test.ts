import { describe, it, expect, vi } from "vitest";
import OmniDimension from "../src/index.js";

// Verifies every resource method issues the correct HTTP verb and path.
// This is the routing contract against the OpenAPI spec: a typo in a
// path or verb in any thin resource proxy fails here.

function setup() {
  const calls: { method: string; path: string }[] = [];
  const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const path = String(url).replace("https://backend.omnidim.io/api/v1", "");
    calls.push({ method: init?.method ?? "GET", path });
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  }) as unknown as typeof fetch;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = new OmniDimension({ apiKey: "test-api-key-1234", fetch }) as any;
  return { c, calls };
}

const ID = 7;
const B = {} as never;

const cases: [string, (c: any) => Promise<unknown>, string, string][] = [
  ["agents.list", (c) => c.agents.list(), "GET", "/agents"],
  ["agents.create", (c) => c.agents.create(B), "POST", "/agents/create"],
  ["agents.get", (c) => c.agents.get(ID), "GET", "/agents/7"],
  ["agents.update", (c) => c.agents.update(ID, B), "PUT", "/agents/7"],
  ["agents.delete", (c) => c.agents.delete(ID), "DELETE", "/agents/7"],
  ["calls.dispatch", (c) => c.calls.dispatch(B), "POST", "/calls/dispatch"],
  ["calls.listLogs", (c) => c.calls.listLogs(), "GET", "/calls/logs"],
  ["calls.getLog", (c) => c.calls.getLog(ID), "GET", "/calls/logs/7"],
  ["bulkCalls.list", (c) => c.bulkCalls.list(), "GET", "/calls/bulk_call"],
  ["bulkCalls.create", (c) => c.bulkCalls.create(B), "POST", "/calls/bulk_call/create"],
  ["bulkCalls.get", (c) => c.bulkCalls.get(ID), "GET", "/calls/bulk_call/7"],
  ["bulkCalls.action", (c) => c.bulkCalls.action(ID, B), "PUT", "/calls/bulk_call/7"],
  ["bulkCalls.cancel", (c) => c.bulkCalls.cancel(ID), "DELETE", "/calls/bulk_call/7"],
  ["bulkCalls.liveStatus", (c) => c.bulkCalls.liveStatus(ID), "GET", "/bulk-call/7/live-status"],
  ["knowledgeBase.list", (c) => c.knowledgeBase.list(), "GET", "/knowledge_base/list"],
  ["knowledgeBase.canUpload", (c) => c.knowledgeBase.canUpload(B), "POST", "/knowledge_base/can_upload"],
  ["knowledgeBase.upload", (c) => c.knowledgeBase.upload(B), "POST", "/knowledge_base/create"],
  ["knowledgeBase.attach", (c) => c.knowledgeBase.attach(B), "POST", "/knowledge_base/attach"],
  ["knowledgeBase.detach", (c) => c.knowledgeBase.detach(B), "POST", "/knowledge_base/detach"],
  ["knowledgeBase.delete", (c) => c.knowledgeBase.delete(B), "POST", "/knowledge_base/delete"],
  ["phoneNumbers.list", (c) => c.phoneNumbers.list(), "GET", "/phone_number/list"],
  ["phoneNumbers.attach", (c) => c.phoneNumbers.attach(B), "POST", "/phone_number/attach"],
  ["phoneNumbers.detach", (c) => c.phoneNumbers.detach(B), "POST", "/phone_number/detach"],
  ["phoneNumbers.importTwilio", (c) => c.phoneNumbers.importTwilio(B), "POST", "/phone_number/import/twilio"],
  ["phoneNumbers.importExotel", (c) => c.phoneNumbers.importExotel(B), "POST", "/phone_number/import/exotel"],
  ["phoneNumbers.importSip", (c) => c.phoneNumbers.importSip(B), "POST", "/phone_number/import/sip"],
  ["providers.listLLMs", (c) => c.providers.listLLMs(), "GET", "/providers/llms"],
  ["providers.listVoices", (c) => c.providers.listVoices(), "GET", "/providers/voices"],
  ["providers.listSTT", (c) => c.providers.listSTT(), "GET", "/providers/stt"],
  ["providers.listTTS", (c) => c.providers.listTTS(), "GET", "/providers/tts"],
  ["providers.listAll", (c) => c.providers.listAll(), "GET", "/providers/all"],
  ["providers.getVoice", (c) => c.providers.getVoice(ID), "GET", "/providers/voice/7"],
  ["reseller.listOrganizations", (c) => c.reseller.listOrganizations(), "GET", "/reseller/organizations"],
  ["reseller.addUser", (c) => c.reseller.addUser(B), "POST", "/reseller/users/add"],
  ["reseller.setUserAccessControl", (c) => c.reseller.setUserAccessControl(B), "POST", "/reseller/users/access-control"],
  ["reseller.setUserExpiry", (c) => c.reseller.setUserExpiry(B), "POST", "/reseller/users/expiry"],
  ["reseller.setConcurrency", (c) => c.reseller.setConcurrency(B), "POST", "/reseller/concurrency"],
  ["reseller.calculateCredits", (c) => c.reseller.calculateCredits(B), "POST", "/reseller/credits/calculate"],
  ["reseller.transferCredits", (c) => c.reseller.transferCredits(B), "POST", "/reseller/credits/transfer"],
  ["reseller.revertCredits", (c) => c.reseller.revertCredits(B), "POST", "/reseller/credits/revert"],
  ["reseller.creditLogs", (c) => c.reseller.creditLogs(), "GET", "/reseller/credits/logs"],
  ["integrations.list", (c) => c.integrations.list(), "GET", "/integrations"],
  ["integrations.listForAgent", (c) => c.integrations.listForAgent(ID), "GET", "/agents/7/integrations"],
  ["integrations.createCustomApi", (c) => c.integrations.createCustomApi(B), "POST", "/integrations/custom-api"],
  ["integrations.createCal", (c) => c.integrations.createCal(B), "POST", "/integrations/cal"],
  ["integrations.addToAgent", (c) => c.integrations.addToAgent(ID, 3), "POST", "/agents/7/integrations"],
  ["integrations.removeFromAgent", (c) => c.integrations.removeFromAgent(ID, 3), "DELETE", "/agents/7/integrations/3"],
];

describe("resource routing", () => {
  it("covers all resource methods", () => {
    expect(cases).toHaveLength(47);
  });

  for (const [name, call, method, path] of cases) {
    it(`${name} -> ${method} ${path}`, async () => {
      const { c, calls } = setup();
      await call(c);
      expect(calls[0]).toEqual({ method, path });
    });
  }
});
