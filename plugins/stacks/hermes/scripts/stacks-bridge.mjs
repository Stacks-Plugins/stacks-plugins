#!/usr/bin/env node
/**
 * Hermes bridge: delegates all Stacks tool calls to @sugarhi11/agent-core
 * so Python handlers stay thin and match ElizaOS / OpenClaw behavior.
 *
 * Usage:
 *   node stacks-bridge.mjs <tool_name> '<json_params>'
 *
 * Private key resolution for write tools (first match wins):
 *   1. params.senderKey
 *   2. process.env.STACKS_SENDER_KEY
 */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let core;
try {
  core = require('@sugarhi11/agent-core');
} catch (err) {
  emit({ success: false, error: `Failed to load @sugarhi11/agent-core: ${err.message}. Run npm install in plugins/stacks/hermes.` });
  process.exit(1);
}

const { STACKS_TOOLS } = core;

/** @type {Record<string, Function>} */
const HANDLERS = Object.fromEntries(STACKS_TOOLS.map((t) => [t.name, t.handler]));

/** @type {Record<string, { write?: boolean }>} */
const META = Object.fromEntries(STACKS_TOOLS.map((t) => [t.name, t]));

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
    fail("Usage: node stacks-bridge.mjs <tool_name> '<json_params>'");
  }

  const handler = HANDLERS[tool];
  if (!handler) {
    const available = Object.keys(HANDLERS).join(', ');
    fail(`Unknown tool "${tool}". Available tools: ${available}`);
  }

  /** @type {Record<string, unknown>} */
  let params;
  try {
    params = JSON.parse(rawParams);
  } catch {
    fail(`Invalid JSON params: ${rawParams}`);
  }

  if (!params.network && process.env.STACKS_NETWORK) {
    params.network = process.env.STACKS_NETWORK;
  }

  const meta = META[tool];
  if (meta?.write) {
    if (!params.senderKey && process.env.STACKS_SENDER_KEY) {
      params.senderKey = process.env.STACKS_SENDER_KEY;
    }
    if (!params.senderKey) {
      fail(
        'No sender key. Set STACKS_SENDER_KEY in the environment or pass senderKey in params.'
      );
    }
  }

  try {
    const result = await handler(params);
    emit({ success: true, result });
  } catch (err) {
    fail(err?.message ?? String(err));
  }
}

main();
