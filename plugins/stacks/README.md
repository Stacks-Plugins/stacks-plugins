# Stacks AI Agent Plugins

All Stacks agent integrations live in this directory.

```
plugins/stacks/
├── agent-core/     @stacks/agent-core — shared TypeScript tool implementations
├── eliza/          ElizaOS plugin (actions)
├── openclaw/       OpenClaw plugin (registerTool + manifest)
├── hermes/         Hermes plugin (Python + Node write bridge)
├── eve/            eve extension (defineExtension + defineTool)
├── .env.example    Environment variables for local dev
└── README.md
```

## Quick start

```bash
# Shared core
cd plugins/stacks/agent-core && npm install && npm run build

# Adapters (pick what you need)
cd ../eliza && npm install && npm run build
cd ../openclaw && npm install && npm run build
cd ../eve && npm install && npm run build   # Node 24+

cp plugins/stacks/.env.example plugins/stacks/.env
# Edit .env — set STACKS_NETWORK=testnet and STACKS_SENDER_KEY for write tests

# From repo root (when the test script is present)
node scripts/test-agent-plugins.mjs
```

### eve mount

```ts
// agent/extensions/stacks.ts
import stacks from "@stacks/eve-stacks";

export default stacks({
  defaultNetwork: (process.env.STACKS_NETWORK as "mainnet" | "testnet") ?? "testnet",
  senderKey: process.env.STACKS_SENDER_KEY,
});
```

See [docs/frameworks/eve.mdx](../../docs/frameworks/eve.mdx) for full setup.

## Install per framework

| Framework | Path | Install |
|-----------|------|---------|
| **ElizaOS** | `eliza/` | Import `stacksPlugin` from `plugin-eliza-stacks` |
| **OpenClaw** | `openclaw/` | `openclaw plugins install ./plugins/stacks/openclaw` |
| **Hermes** | `hermes/` | Copy/symlink to `~/.hermes/plugins/stacks/` and enable in config |
| **eve** | `eve/` | `pnpm add @stacks/eve-stacks` then mount in `agent/extensions/stacks.ts` |

## Tool surface

All adapters expose the same 19 tools (balance, transfers, history, stacking, BNS, contracts, swaps, bridge). Logic is implemented once in `agent-core/`; Eliza, OpenClaw, and eve import it directly; Hermes uses `httpx` for reads and `hermes/scripts/stacks-write.mjs` for writes.

eve mounts use a double-underscore namespace (`stacks__get_balance`); the other frameworks use `stacks_get_balance`.
