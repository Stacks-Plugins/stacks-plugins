# Stacks AI Agent Plugins

All Stacks agent integrations live in this directory.

```
plugins/stacks/
├── agent-core/     @stacks/agent-core — shared TypeScript tool implementations
├── eliza/          ElizaOS plugin (actions)
├── openclaw/       OpenClaw plugin (registerTool + manifest)
├── hermes/         Hermes plugin (Python + Node write bridge)
├── .env.example    Environment variables for local dev
└── README.md
```

## Quick start

```bash
# From repo root
npm install
npm run build -w @stacks/agent-core
npm run build -w plugin-eliza-stacks
npm run build -w @stacks/openclaw-stacks

cp plugins/stacks/.env.example plugins/stacks/.env
# Edit .env — set STACKS_NETWORK=testnet and STACKS_SENDER_KEY for write tests

node scripts/test-agent-plugins.mjs
```

## Install per framework

| Framework | Path | Install |
|-----------|------|---------|
| **ElizaOS** | `eliza/` | Import `stacksPlugin` from `plugin-eliza-stacks` |
| **OpenClaw** | `openclaw/` | `openclaw plugins install ./plugins/stacks/openclaw` |
| **Hermes** | `hermes/` | Copy/symlink to `~/.hermes/plugins/stacks/` and enable in config |

## Tool surface

All three plugins expose the same 19 tools (balance, transfers, history, stacking, BNS, contracts, swaps, bridge). Logic is implemented once in `agent-core/`; Eliza and OpenClaw import it directly; Hermes uses `httpx` for reads and `hermes/scripts/stacks-write.mjs` for writes.
