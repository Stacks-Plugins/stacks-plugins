/**
 * eve@0.27.x authored-module bundles externalize deps as absolute Windows paths
 * (`C:\\...`) without converting them to `file://` URLs. Node's ESM loader then
 * rejects the import. Normalize those specifiers before the bundle is written.
 *
 * Safe no-op when already patched or when the needle is absent (newer eve).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
let eveEntry;
try {
  eveEntry = require.resolve("eve/package.json");
} catch {
  console.warn("[patch-eve-windows-imports] eve not installed; skipping");
  process.exit(0);
}

const target = join(
  dirname(eveEntry),
  "dist/src/internal/authored-module-loader.js"
);

if (!existsSync(target)) {
  console.warn(`[patch-eve-windows-imports] missing ${target}; skipping`);
  process.exit(0);
}

const source = readFileSync(target, "utf8");
const marker = "normalizeGeneratedEsmImportSpecifiers(o)";
if (source.includes(marker)) {
  console.log("[patch-eve-windows-imports] already applied");
  process.exit(0);
}

const needle = "writeFileSync(d,o)";
if (!source.includes(needle)) {
  console.warn(
    "[patch-eve-windows-imports] writeFileSync(d,o) not found; skipping (eve may have fixed this)"
  );
  process.exit(0);
}

const importLine =
  'import{normalizeGeneratedEsmImportSpecifiers}from"#internal/application/import-specifier.js";';

let next = source;
if (!next.includes("normalizeGeneratedEsmImportSpecifiers")) {
  // Insert after the first import statement block start.
  next = next.replace(
    /^import/,
    `${importLine}import`
  );
}

next = next.replace(
  needle,
  "writeFileSync(d,normalizeGeneratedEsmImportSpecifiers(o))"
);

writeFileSync(target, next);
console.log("[patch-eve-windows-imports] patched authored-module-loader.js");
