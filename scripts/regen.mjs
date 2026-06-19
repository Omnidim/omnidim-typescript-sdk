#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_META = join(ROOT, ".spec.yml");
const OUT = join(ROOT, "src", "generated", "types.ts");

// The only spec fetched over the network is the published doc. The value
// in .spec.yml (or $SPEC) is compared against this constant and the
// constant itself is fetched, so external data never controls the request.
const SPEC_URL = "https://docs.omnidim.io/openapi.yaml";
const MAX_SPEC_BYTES = 8 * 1024 * 1024;

function specUrl() {
  const text = readFileSync(SPEC_META, "utf8");
  const match = text.match(/^openapi_spec_url:\s*(\S+)/m);
  if (!match) throw new Error("openapi_spec_url not found in .spec.yml");
  return match[1];
}

async function loadSpec() {
  const source = process.env.SPEC || specUrl();
  if (/^https?:\/\//.test(source)) {
    if (source !== SPEC_URL) {
      throw new Error(`only ${SPEC_URL} may be fetched over https (got: ${source})`);
    }
    const res = await fetch(SPEC_URL);
    if (!res.ok) {
      throw new Error(`failed to fetch spec: ${res.status} ${SPEC_URL}`);
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length > MAX_SPEC_BYTES) {
      throw new Error(`spec is unexpectedly large (${bytes.length} bytes)`);
    }
    return { bytes, source: SPEC_URL };
  }
  // Local file override for development (e.g. SPEC=../omnidim-docs/openapi/omnidim.yaml).
  return { bytes: readFileSync(resolve(source)), source: resolve(source) };
}

const { bytes, source } = await loadSpec();
console.log(`spec source: ${source} (${bytes.length} bytes)`);

// Generate from the spec held in memory. openapi-typescript parses the
// document and we write only the derived TypeScript, never the raw bytes.
const BANNER = `/**
 * This file is auto-generated from the OmniDimension OpenAPI spec.
 * Do not make direct changes to the file. Run \`npm run regen\` to refresh.
 */

`;
const ast = await openapiTS(bytes);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, BANNER + astToString(ast));

const hash = createHash("sha256").update(bytes).digest("hex");
const meta = readFileSync(SPEC_META, "utf8").replace(
  /^openapi_spec_hash:.*$/m,
  `openapi_spec_hash: "${hash}"`,
);
writeFileSync(SPEC_META, meta);
console.log(`wrote ${OUT}`);
console.log(`spec hash: ${hash}`);
