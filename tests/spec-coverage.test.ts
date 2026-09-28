import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Resource methods are hand-written; src/generated/types.ts is not. A new
// endpoint therefore lands fully typed and completely uncallable, and nothing
// notices. That is how ten bulk-call operations sat unimplemented.
//
// An absence that is on purpose goes in DELIBERATE with a reason. An absence
// without one is the only thing that fails.
const DELIBERATE: Record<string, string> = {
  createSession: "browser-side; the @omnidim-ai/client web SDK owns the session flow",
  listSimulations: "simulations are undocumented and unstable",
  createSimulation: "simulations are undocumented and unstable",
  getSimulation: "simulations are undocumented and unstable",
  updateSimulation: "simulations are undocumented and unstable",
  deleteSimulation: "simulations are undocumented and unstable",
  startSimulation: "simulations are undocumented and unstable",
  stopSimulation: "simulations are undocumented and unstable",
  enhancePrompt: "authoring helper, not a runtime call",
};

const dir = (p: string) => fileURLToPath(new URL(p, import.meta.url));

function specOperations(): string[] {
  const src = readFileSync(dir("../src/generated/types.ts"), "utf8");
  const block = src.slice(src.indexOf("export interface operations {"));
  // Operation names sit at one level of indentation; everything nested under
  // them is deeper, so the indent alone separates them.
  return [...block.matchAll(/^ {4}(\w+): \{$/gm)].map((m) => m[1]);
}

function implementedOperations(): Set<string> {
  const resources = dir("../src/resources/");
  const found = new Set<string>();
  for (const file of readdirSync(resources)) {
    const src = readFileSync(resources + file, "utf8");
    for (const m of src.matchAll(/ResultOf<"(\w+)">/g)) found.add(m[1]);
  }
  return found;
}

describe("spec coverage", () => {
  const operations = specOperations();
  const implemented = implementedOperations();

  it("finds the generated operations", () => {
    expect(operations.length).toBeGreaterThan(50);
  });

  it("has a method or a stated reason for every operation", () => {
    const undeclared = operations.filter(
      (id) => !implemented.has(id) && !(id in DELIBERATE),
    );
    expect(undeclared, `no method for: ${undeclared.join(", ")}`).toEqual([]);
  });

  it("does not excuse an operation that is implemented", () => {
    const stale = Object.keys(DELIBERATE).filter((id) => implemented.has(id));
    expect(stale, `implemented but still listed as deliberate: ${stale.join(", ")}`).toEqual([]);
  });
});
