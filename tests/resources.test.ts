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
  ["account.balance", (c) => c.account.balance(), "GET", "/account/balance"],
  ["agents.list", (c) => c.agents.list(), "GET", "/agents"],
  ["agents.create", (c) => c.agents.create(B), "POST", "/agents/create"],
  ["agents.get", (c) => c.agents.get(ID), "GET", "/agents/7"],
  ["agents.update", (c) => c.agents.update(ID, B), "PUT", "/agents/7"],
  ["agents.delete", (c) => c.agents.delete(ID), "DELETE", "/agents/7"],
  ["agents.listVersions", (c) => c.agents.listVersions(ID), "GET", "/agents/7/versions"],
  ["agents.saveVersion", (c) => c.agents.saveVersion(ID, B), "POST", "/agents/7/versions"],
  ["agents.diffVersion", (c) => c.agents.diffVersion(ID, 3), "GET", "/agents/7/versions/3/diff"],
  ["agents.restoreVersion", (c) => c.agents.restoreVersion(ID, 3), "POST", "/agents/7/versions/3/restore"],
  ["agents.renameVersion", (c) => c.agents.renameVersion(ID, 3, B), "PATCH", "/agents/7/versions/3"],
  ["agents.deleteVersion", (c) => c.agents.deleteVersion(ID, 3), "DELETE", "/agents/7/versions/3"],
  ["calls.dispatch", (c) => c.calls.dispatch(B), "POST", "/calls/dispatch"],
  ["calls.listLogs", (c) => c.calls.listLogs(), "GET", "/calls/logs"],
  ["calls.getLog", (c) => c.calls.getLog(ID), "GET", "/calls/logs/7"],
  ["bulkCalls.list", (c) => c.bulkCalls.list(), "GET", "/calls/bulk_call"],
  ["bulkCalls.create", (c) => c.bulkCalls.create(B), "POST", "/calls/bulk_call/create"],
  ["bulkCalls.get", (c) => c.bulkCalls.get(ID), "GET", "/calls/bulk_call/7"],
  ["bulkCalls.action", (c) => c.bulkCalls.action(ID, B), "PUT", "/calls/bulk_call/7"],
  ["bulkCalls.cancel", (c) => c.bulkCalls.cancel(ID), "DELETE", "/calls/bulk_call/7"],
  ["bulkCalls.liveStatus", (c) => c.bulkCalls.liveStatus(ID), "GET", "/bulk-call/7/live-status"],
  ["bulkCalls.listLines", (c) => c.bulkCalls.listLines(ID), "GET", "/calls/bulk_call/7/lines"],
  ["bulkCalls.start", (c) => c.bulkCalls.start(ID), "POST", "/calls/bulk_call/7/start"],
  ["bulkCalls.addContact", (c) => c.bulkCalls.addContact(ID, B), "POST", "/calls/bulk_call/7/add_contact"],
  ["bulkCalls.addContacts", (c) => c.bulkCalls.addContacts(ID, B), "POST", "/calls/bulk_call/7/add_contacts"],
  ["bulkCalls.setConcurrency", (c) => c.bulkCalls.setConcurrency(ID, B), "PUT", "/calls/bulk_call/7/concurrency"],
  [
    "bulkCalls.setDailyTimeControl",
    (c) => c.bulkCalls.setDailyTimeControl(ID, B),
    "PUT",
    "/calls/bulk_call/7/daily-time-control",
  ],
  ["bulkCalls.retry", (c) => c.bulkCalls.retry(ID), "POST", "/calls/bulk_call/7/manual_retry"],
  ["bulkCalls.listNumbers", (c) => c.bulkCalls.listNumbers(ID), "GET", "/calls/bulk_call/7/numbers"],
  ["bulkCalls.addNumber", (c) => c.bulkCalls.addNumber(ID, B), "POST", "/calls/bulk_call/7/numbers"],
  [
    "bulkCalls.setNumberActive",
    (c) => c.bulkCalls.setNumberActive(ID, 3, B),
    "PUT",
    "/calls/bulk_call/7/numbers/3",
  ],
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
  ["phoneNumbers.search", (c) => c.phoneNumbers.search(), "GET", "/phone_number/search"],
  ["phoneNumbers.purchase", (c) => c.phoneNumbers.purchase(B), "POST", "/phone_number/purchase"],
  ["phoneNumbers.release", (c) => c.phoneNumbers.release(B), "POST", "/phone_number/release"],
  ["providers.listLLMs", (c) => c.providers.listLLMs(), "GET", "/providers/llms"],
  ["providers.listVoices", (c) => c.providers.listVoices(), "GET", "/providers/voices"],
  ["providers.listSTT", (c) => c.providers.listSTT(), "GET", "/providers/stt"],
  ["providers.listTTS", (c) => c.providers.listTTS(), "GET", "/providers/tts"],
  ["providers.listAll", (c) => c.providers.listAll(), "GET", "/providers/all"],
  ["providers.getVoice", (c) => c.providers.getVoice(ID), "GET", "/providers/voice/7"],
  ["voices.listClonedVoices", (c) => c.voices.listClonedVoices(), "GET", "/voices"],
  ["voices.createClonedVoice", (c) => c.voices.createClonedVoice(B), "POST", "/voices"],
  ["voices.getClonedVoice", (c) => c.voices.getClonedVoice(ID), "GET", "/voices/7"],
  ["voices.updateClonedVoice", (c) => c.voices.updateClonedVoice(ID, B), "PATCH", "/voices/7"],
  ["voices.deleteClonedVoice", (c) => c.voices.deleteClonedVoice(ID), "DELETE", "/voices/7"],
  ["voices.getClonedVoiceSample", (c) => c.voices.getClonedVoiceSample(ID), "GET", "/voices/7/sample"],
  ["voices.regenerateClonedVoiceSample", (c) => c.voices.regenerateClonedVoiceSample(ID), "POST", "/voices/7/sample"],
  ["reseller.listOrganizations", (c) => c.reseller.listOrganizations(), "GET", "/reseller/organizations"],
  ["reseller.addUser", (c) => c.reseller.addUser(B), "POST", "/reseller/users/add"],
  ["reseller.setUserAccessControl", (c) => c.reseller.setUserAccessControl(B), "POST", "/reseller/users/access-control"],
  ["reseller.setUserExpiry", (c) => c.reseller.setUserExpiry(B), "POST", "/reseller/users/expiry"],
  ["reseller.setConcurrency", (c) => c.reseller.setConcurrency(B), "POST", "/reseller/concurrency"],
  ["reseller.calculateCredits", (c) => c.reseller.calculateCredits(B), "POST", "/reseller/credits/calculate"],
  ["reseller.transferCredits", (c) => c.reseller.transferCredits(B), "POST", "/reseller/credits/transfer"],
  ["reseller.revertCredits", (c) => c.reseller.revertCredits(B), "POST", "/reseller/credits/revert"],
  ["reseller.creditLogs", (c) => c.reseller.creditLogs(), "GET", "/reseller/credits/logs"],
  ["reseller.kycStatus", (c) => c.reseller.kycStatus({ user_id: ID }), "GET", "/reseller/kyc/status?user_id=7"],
  [
    "reseller.kycRequirements",
    (c) => c.reseller.kycRequirements({ region: "IN", carrier: "carrier-1" }),
    "GET",
    "/reseller/kyc/requirements?region=IN&carrier=carrier-1",
  ],
  [
    "reseller.submitKycStep",
    (c) => c.reseller.submitKycStep("aadhaar-otp", B),
    "POST",
    "/reseller/kyc/steps/aadhaar-otp",
  ],
  [
    "reseller.uploadKycDocument",
    (c) =>
      c.reseller.uploadKycDocument("upload-pan", { user_id: ID, region: "IN" }, new Blob(["x"]), "pan.pdf"),
    "POST",
    "/reseller/kyc/steps/upload-pan",
  ],
  ["reseller.setClientAccess", (c) => c.reseller.setClientAccess(B), "POST", "/reseller/users/access"],
  ["reseller.usage", (c) => c.reseller.usage({ month: "2026-09" }), "GET", "/reseller/usage?month=2026-09"],
  ["reseller.clientUsage", (c) => c.reseller.clientUsage(ID), "GET", "/reseller/usage/clients/7"],
  ["reseller.getIdentity", (c) => c.reseller.getIdentity(), "GET", "/reseller/identity"],
  ["reseller.saveIdentity", (c) => c.reseller.saveIdentity(B), "POST", "/reseller/identity/save"],
  ["reseller.saveIdentitySmtp", (c) => c.reseller.saveIdentitySmtp(B), "POST", "/reseller/identity/smtp/save"],
  ["reseller.testIdentitySmtp", (c) => c.reseller.testIdentitySmtp(B), "POST", "/reseller/identity/smtp/test"],
  ["reseller.disableIdentitySmtp", (c) => c.reseller.disableIdentitySmtp(), "POST", "/reseller/identity/smtp/disable"],
  ["reseller.previewClientRelease", (c) => c.reseller.previewClientRelease({ organization_id: ID }), "GET", "/reseller/clients/release-preview?organization_id=7"],
  ["reseller.releaseClient", (c) => c.reseller.releaseClient(B), "POST", "/reseller/clients/release"],
  ["reseller.issueChildApiKey", (c) => c.reseller.issueChildApiKey(B), "POST", "/reseller/users/api-keys"],
  ["reseller.revokeChildApiKey", (c) => c.reseller.revokeChildApiKey(B), "POST", "/reseller/users/api-keys/revoke"],
  ["integrations.list", (c) => c.integrations.list(), "GET", "/integrations"],
  ["integrations.listForAgent", (c) => c.integrations.listForAgent(ID), "GET", "/agents/7/integrations"],
  ["integrations.createCustomApi", (c) => c.integrations.createCustomApi(B), "POST", "/integrations/custom-api"],
  ["integrations.createCal", (c) => c.integrations.createCal(B), "POST", "/integrations/cal"],
  ["integrations.addToAgent", (c) => c.integrations.addToAgent(ID, 3), "POST", "/agents/7/integrations"],
  ["integrations.removeFromAgent", (c) => c.integrations.removeFromAgent(ID, 3), "DELETE", "/agents/7/integrations/3"],
  ["agents.listPostCallActions", (c) => c.agents.listPostCallActions(ID), "GET", "/agents/7/post-call-actions"],
  ["agents.addPostCallAction", (c) => c.agents.addPostCallAction(ID, B), "POST", "/agents/7/post-call-actions"],
  ["agents.updatePostCallAction", (c) => c.agents.updatePostCallAction(ID, 3, B), "PATCH", "/agents/7/post-call-actions/3"],
  ["agents.deletePostCallAction", (c) => c.agents.deletePostCallAction(ID, 3), "DELETE", "/agents/7/post-call-actions/3"],
  ["workflows.listNodeTypes", (c) => c.workflows.listNodeTypes(), "GET", "/workflow-node-types"],
  ["workflows.getNodeType", (c) => c.workflows.getNodeType("http_request"), "GET", "/workflow-node-types/http_request"],
  ["workflows.listFieldOptions", (c) => c.workflows.listFieldOptions("http_request", "agent"), "GET", "/workflow-node-types/http_request/options/agent"],
  ["workflows.list", (c) => c.workflows.list(), "GET", "/workflows"],
  ["workflows.create", (c) => c.workflows.create(B), "POST", "/workflows"],
  ["workflows.get", (c) => c.workflows.get(ID), "GET", "/workflows/7"],
  ["workflows.edit", (c) => c.workflows.edit(ID, B), "PATCH", "/workflows/7"],
  ["workflows.delete", (c) => c.workflows.delete(ID), "DELETE", "/workflows/7"],
  ["workflows.validate", (c) => c.workflows.validate(ID), "POST", "/workflows/7/validate"],
  ["workflows.publish", (c) => c.workflows.publish(ID), "POST", "/workflows/7/publish"],
  ["workflows.activate", (c) => c.workflows.activate(ID), "POST", "/workflows/7/activate"],
  ["workflows.deactivate", (c) => c.workflows.deactivate(ID), "POST", "/workflows/7/deactivate"],
  ["workflows.test", (c) => c.workflows.test(ID), "POST", "/workflows/7/test"],
  ["workflows.getExecution", (c) => c.workflows.getExecution(ID, 3), "GET", "/workflows/7/executions/3"],
];

describe("resource routing", () => {
  it("covers all resource methods", () => {
    expect(cases).toHaveLength(108);
  });

  for (const [name, call, method, path] of cases) {
    it(`${name} -> ${method} ${path}`, async () => {
      const { c, calls } = setup();
      await call(c);
      expect(calls[0]).toEqual({ method, path });
    });
  }
});

describe("reseller identity and client access bodies", () => {
  function capture() {
    const sent: { init?: RequestInit }[] = [];
    const fetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      sent.push({ init });
      return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
    }) as unknown as typeof fetch;
    return { c: new OmniDimension({ apiKey: "test-api-key-1234", fetch }), sent };
  }
  const bodyOf = (sent: { init?: RequestInit }[]) => JSON.parse(sent[0]!.init!.body as string);

  it("saveIdentity sends the brand fields it is given", async () => {
    const { c, sent } = capture();
    await c.reseller.saveIdentity({ platform_name: "Acme Voice", primary_color: "#1976d2" });
    expect(bodyOf(sent)).toEqual({ platform_name: "Acme Voice", primary_color: "#1976d2" });
  });

  it("saveIdentitySmtp sends the server fields", async () => {
    const { c, sent } = capture();
    await c.reseller.saveIdentitySmtp({
      host: "smtp.acme.example", port: 587, username: "u", password: "p",
      encryption: "ssl", from_email: "hello@acme.example",
    });
    expect(Object.keys(bodyOf(sent)).sort()).toEqual(
      ["encryption", "from_email", "host", "password", "port", "username"],
    );
  });

  it("testIdentitySmtp sends no password when none is given", async () => {
    const { c, sent } = capture();
    await c.reseller.testIdentitySmtp({ host: "smtp.acme.example", port: 587, username: "u" });
    expect(Object.keys(bodyOf(sent)).sort()).toEqual(["host", "port", "username"]);
  });

  it("disableIdentitySmtp sends no body", async () => {
    const { c, sent } = capture();
    await c.reseller.disableIdentitySmtp();
    expect(sent[0]!.init!.body).toBeUndefined();
  });

  it("setClientAccess sends blocked, the target and detach_numbers", async () => {
    const { c, sent } = capture();
    await c.reseller.setClientAccess({ blocked: true, organization_id: 5678, detach_numbers: true });
    expect(bodyOf(sent)).toEqual({ blocked: true, organization_id: 5678, detach_numbers: true });
  });
});

describe("workflow and post-call action requests", () => {
  function capture() {
    const sent: { url: string; init: RequestInit }[] = [];
    const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      sent.push({ url: String(url).replace("https://backend.omnidim.io/api/v1", ""), init: init ?? {} });
      return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
    }) as unknown as typeof fetch;
    return { c: new OmniDimension({ apiKey: "test-api-key-1234", fetch }), sent };
  }
  const body = (s: { init: RequestInit }) => JSON.parse(s.init.body as string);

  it("create sends the name and graph", async () => {
    const { c, sent } = capture();
    const graph = { nodes: [], edges: [] } as never;
    await c.workflows.create({ name: "Follow up", graph });
    expect(body(sent[0]!)).toEqual({ name: "Follow up", graph });
  });

  it("edit sends the revision and ops", async () => {
    const { c, sent } = capture();
    const ops = [{ op: "delete_node", id: "a" }] as never;
    await c.workflows.edit(7, { revision: "r1", ops });
    expect(body(sent[0]!)).toEqual({ revision: "r1", ops });
  });

  it("test sends the payload", async () => {
    const { c, sent } = capture();
    await c.workflows.test(7, { payload: { phone: "+15550100" } } as never);
    expect(body(sent[0]!)).toEqual({ payload: { phone: "+15550100" } });
  });

  it("passes the query through on a workflow call", async () => {
    const { c, sent } = capture();
    await c.workflows.getNodeType("http_request", { detail: "full" } as never);
    await c.workflows.activate(7, { user_id: 42 } as never);
    expect(sent[0]!.url).toBe("/workflow-node-types/http_request?detail=full");
    expect(sent[1]!.url).toBe("/workflows/7/activate?user_id=42");
  });

  it("escapes the node type in the path", async () => {
    const { c, sent } = capture();
    await c.workflows.getNodeType("a/b c");
    expect(sent[0]!.url).toBe("/workflow-node-types/a%2Fb%20c");
  });

  it("listPostCallActions passes the user_id query through", async () => {
    const { c, sent } = capture();
    await c.agents.listPostCallActions(7, { user_id: 42 });
    expect(sent[0]!.url).toBe("/agents/7/post-call-actions?user_id=42");
  });

  it("addPostCallAction sends the body and the idempotency key", async () => {
    const { c, sent } = capture();
    await c.agents.addPostCallAction(7, { type: "webhook", url: "https://x.example/h" }, "key-1");
    expect(body(sent[0]!)).toEqual({ type: "webhook", url: "https://x.example/h" });
    expect((sent[0]!.init.headers as Record<string, string>)["Idempotency-Key"]).toBe("key-1");
  });

  it("addPostCallAction sends no idempotency key when none is given", async () => {
    const { c, sent } = capture();
    await c.agents.addPostCallAction(7, { type: "webhook" });
    expect((sent[0]!.init.headers as Record<string, string>)["Idempotency-Key"]).toBeUndefined();
  });

  it("updatePostCallAction sends the changed fields", async () => {
    const { c, sent } = capture();
    await c.agents.updatePostCallAction(7, 3, { url: "https://x.example/v2" });
    expect(body(sent[0]!)).toEqual({ url: "https://x.example/v2" });
  });
});
