#!/usr/bin/env node
/**
 * Hermes write-bridge: delegates signing/broadcasting to @sugarhi11/agent-core
 * so Python handlers stay thin and match ElizaOS / OpenClaw behavior.
 *
 * Usage:
 *   node stacks-write.mjs <tool_name> '<json_params>'
 *
 * Private key resolution (first match wins):
 *   1. params.senderKey
 *   2. process.env.STACKS_SENDER_KEY
 */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let core;
try {
  core = require('@sugarhi11/agent-core');
} catch (err) {
  emit({ success: false, error: `Failed to load @sugarhi11/agent-core: ${err.message}. Run npm install in plugins/stacks/hermes (or npm install @sugarhi11/agent-core).` });
  process.exit(1);
}

const { STACKS_TOOLS } = core;

/** @type {Record<string, Function>} */
const WRITE_HANDLERS = Object.fromEntries(
  STACKS_TOOLS.filter((t) => t.write).map((t) => [t.name, t.handler])
);

function emit(obj) {
  console.log(JSON.stringify(obj));
}

function fail(message, code = 1) {
  emit({ success: false, error: message });
  process.exit(code);
}

async function main() {
  const tool = process.argv[2];
  const rawParams = process.argv[3] ?? '{}';

  if (!tool) {
    fail('Usage: node stacks-write.mjs <tool_name> \'<json_params>\'');
  }

  const handler = WRITE_HANDLERS[tool];
  if (!handler) {
    const available = Object.keys(WRITE_HANDLERS).join(', ');
    fail(`Unknown or non-write tool "${tool}". Available write tools: ${available}`);
  }

  /** @type {Record<string, unknown>} */
  let params;
  try {
    params = JSON.parse(rawParams);
  } catch {
    fail(`Invalid JSON params: ${rawParams}`);
  }

  if (!params.senderKey && process.env.STACKS_SENDER_KEY) {
    params.senderKey = process.env.STACKS_SENDER_KEY;
  }

  if (!params.senderKey) {
    fail(
      'No sender key. Set STACKS_SENDER_KEY in the environment or pass senderKey in params.'
    );
  }

  if (!params.network && process.env.STACKS_NETWORK) {
    params.network = process.env.STACKS_NETWORK;
  }

  try {
    const result = await handler(params);
    emit({ success: true, result });
  } catch (err) {
    fail(err?.message ?? String(err));
  }
}

main();
