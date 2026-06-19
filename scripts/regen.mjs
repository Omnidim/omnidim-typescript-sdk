#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_META = join(ROOT, ".spec.yml");
const OUT = join(ROOT, "src", "generated", "types.ts");

// The spec is only ever fetched from the published docs host. Pinning the
// scheme and host means a value read from .spec.yml (or $SPEC) can't be
// turned into an arbitrary outbound request.
const ALLOWED_SPEC_HOSTS = new Set(["docs.omnidim.io"]);
const MAX_SPEC_BYTES = 8 * 1024 * 1024;

function specUrl() {
  const text = readFileSync(SPEC_META, "utf8");
  const match = text.match(/^openapi_spec_url:\s*(\S+)/m);
  if (!match) throw new Error("openapi_spec_url not found in .spec.yml");
  return match[1];
}

function checkedUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`invalid spec URL: ${raw}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`spec URL must use https: ${raw}`);
  }
  if (!ALLOWED_SPEC_HOSTS.has(url.hostname)) {
    throw new Error(
      `spec host ${url.hostname} is not allowed (expected: ${[...ALLOWED_SPEC_HOSTS].join(", ")})`,
    );
  }
  return url;
}

async function loadSpec() {
  const source = process.env.SPEC || specUrl();
  if (/^https?:\/\//.test(source)) {
    const url = checkedUrl(source);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`failed to fetch spec: ${res.status} ${url.href}`);
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length > MAX_SPEC_BYTES) {
      throw new Error(`spec is unexpectedly large (${bytes.length} bytes)`);
    }
    return { bytes, source: url.href };
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
