# Stacks AI Agent Plugins

All Stacks agent integrations live in this directory.

```
plugins/stacks/
├── agent-core/     @stacks/agent-core — shared TypeScript tool implementations
├── eliza/          plugin-eliza-stacks — ElizaOS actions + wallet provider
├── openclaw/       @stacks/openclaw-stacks — OpenClaw registerTool + manifest
├── hermes/         Hermes plugin (Python + Node bridge)
└── README.md
```

Framework adapters consume **`@sugarhi11/agent-core`** from npm, which is built from `agent-core/`.

## Quick start

Build packages individually (there is no root workspace):

```bash
# Shared core (local development)
cd plugins/stacks/agent-core
npm install && npm run build

# ElizaOS
cd ../eliza
npm install && npm run build

# OpenClaw
cd ../openclaw
npm install && npm run build

# Hermes (Node bridge deps)
cd ../hermes
npm install
```

Configure wallet and network via environment variables:

```bash
export STACKS_NETWORK=testnet
export STACKS_SENDER_KEY=your_testnet_private_key_hex   # required for write tools
export STACKS_WALLET_ADDRESS=ST...                      # optional; derived from sender key on active network
export BITCOIN_PRIVATE_KEY=...                          # sBTC peg-in only
export BITCOIN_ADDRESS=tb1...                           # sBTC peg-in only
```

Run OpenClaw unit tests from `openclaw/`:

```bash
cd plugins/stacks/openclaw && npm test
```

## Install per framework

| Framework | Path | Install |
| --- | --- | --- |
| **ElizaOS** | `eliza/` | Import `stacksPlugin` from `plugin-eliza-stacks` |
| **OpenClaw** | `openclaw/` | `openclaw plugins install ./plugins/stacks/openclaw` |
| **Hermes** | `hermes/` | Copy/symlink to `~/.hermes/plugins/stacks/` and enable in config |

## Tool surface

All three plugins expose the same **33 core tools** (balance, transfers, history, stacking, BNS, contracts, swaps, bridge, sBTC, Zest). OpenClaw also registers **`stacks_wallet_info`** for wallet/network status (34 tools total).

| Plugin | Implementation |
| --- | --- |
| **ElizaOS** | Imports `@sugarhi11/agent-core` handlers; `STACKS_WALLET` provider injects wallet context |
| **OpenClaw** | Registers tools with TypeBox schemas via `defineToolPlugin` |
| **Hermes** | Python handlers call `scripts/stacks-bridge.mjs`, which dispatches to `@sugarhi11/agent-core` |

Hermes also ships a bundled skill (`skills/stacks-onchain/`), a `/stacks` slash command, and `pre_llm_call` / `post_tool_call` hooks.

See [docs/tools/overview.mdx](../../docs/tools/overview.mdx) for the full tool list.

The marketing landing page showcasing these frameworks lives in [`web/`](../../web/).
