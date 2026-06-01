#!/usr/bin/env node
// Regenerate src/generated/types.ts from the OmniDimension OpenAPI spec
// and stamp the spec hash into .spec.yml.
//
// Spec source resolution order:
//   1. SPEC env var (path or URL)
//   2. sibling checkout ../omnidim-docs/openapi/omnidim.yaml (local dev)
//   3. openapi_spec_url in .spec.yml (CI / standalone checkout)

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_META = join(ROOT, ".spec.yml");
const OUT = join(ROOT, "src", "generated", "types.ts");

function readSpecUrlFromMeta() {
  const text = readFileSync(SPEC_META, "utf8");
  const match = text.match(/^openapi_spec_url:\s*(\S+)/m);
  if (!match) throw new Error("openapi_spec_url not found in .spec.yml");
  return match[1];
}

async function loadSpec() {
  const local = resolve(ROOT, "..", "omnidim-docs", "openapi", "omnidim.yaml");
  const source = process.env.SPEC || (existsSync(local) ? local : readSpecUrlFromMeta());
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`failed to fetch spec: ${res.status} ${source}`);
    return { bytes: Buffer.from(await res.arrayBuffer()), source };
  }
  return { bytes: readFileSync(resolve(source)), source: resolve(source) };
}

const { bytes, source } = await loadSpec();
console.log(`spec source: ${source} (${bytes.length} bytes)`);

const tmp = mkdtempSync(join(tmpdir(), "omnidim-sdk-regen-"));
const specFile = join(tmp, "omnidim.yaml");
writeFileSync(specFile, bytes);

try {
  const bin = join(ROOT, "node_modules", ".bin", "openapi-typescript");
  execFileSync(bin, [specFile, "-o", OUT], { stdio: "inherit" });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const hash = createHash("sha256").update(bytes).digest("hex");
const meta = readFileSync(SPEC_META, "utf8").replace(
  /^openapi_spec_hash:.*$/m,
  `openapi_spec_hash: "${hash}"`,
);
writeFileSync(SPEC_META, meta);
console.log(`wrote ${OUT}`);
console.log(`spec hash: ${hash}`);
