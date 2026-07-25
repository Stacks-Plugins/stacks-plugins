# Stacks Plugins

AI agent plugins for the [Stacks](https://www.stacks.co/) blockchain. Expose balances, STX transfers, account history, PoX stacking, BNS naming, Clarity contracts, ALEX swaps, Allbridge bridging, sBTC peg-in/out, and Zest yield to LLM agents through **ElizaOS**, **OpenClaw**, and **Hermes**.

Documentation lives in [`docs/`](docs/) (Mintlify). Preview locally with `mintlify dev` from the `docs/` directory.

The marketing landing page lives in [`web/`](web/). Run `npm run dev` from `web/` after setting `NEXT_PUBLIC_DOCS_URL`.

## Repository layout

```
stacks-plugins/
├── docs/                       Mintlify documentation site
├── web/                        Next.js marketing landing page
├── plugins/stacks/
│   ├── agent-core/             @stacks/agent-core — shared tool implementations (source)
│   ├── eliza/                  plugin-eliza-stacks — ElizaOS actions + wallet provider
│   ├── openclaw/               @stacks/openclaw-stacks — OpenClaw registerTool adapter
│   └── hermes/                 Hermes Python plugin + Node bridge
└── README.md
```

There is no root `package.json`. Each TypeScript package is built independently. Framework adapters depend on the published npm package **`@sugarhi11/agent-core`**, which is built from `plugins/stacks/agent-core`.

## Packages

| Package | Path | Role |
| --- | --- | --- |
| `@sugarhi11/agent-core` | `plugins/stacks/agent-core` | Framework-agnostic tool handlers and `STACKS_TOOLS` registry |
| `plugin-eliza-stacks` | `plugins/stacks/eliza` | ElizaOS plugin — 33 actions + `STACKS_WALLET` provider |
| `@stacks/openclaw-stacks` | `plugins/stacks/openclaw` | OpenClaw plugin — 33 core tools + `stacks_wallet_info` |
| Hermes plugin | `plugins/stacks/hermes` | Python tool registration, hooks, `/stacks` command, bundled skills |

## Quick start

```bash
git clone https://github.com/Stacks-Plugins/stacks-plugins.git
cd stacks-plugins

# Build shared core (optional if using published @sugarhi11/agent-core from npm)
cd plugins/stacks/agent-core && npm install && npm run build && cd ../../..

# Build a framework adapter
cd plugins/stacks/eliza && npm install && npm run build
# — or —
cd plugins/stacks/openclaw && npm install && npm run build
# — or —
cd plugins/stacks/hermes && npm install   # Node deps for the bridge
```

Set environment variables for wallet-aware agents:

```bash
export STACKS_NETWORK=testnet
export STACKS_SENDER_KEY=your_testnet_private_key_hex   # write tools only
export STACKS_WALLET_ADDRESS=ST...                      # optional; derived from sender key if omitted
export BITCOIN_PRIVATE_KEY=...                          # sBTC peg-in only
export BITCOIN_ADDRESS=bc1...                           # sBTC peg-in only
```

See [Configuration](docs/configuration.mdx) and [Quick start](docs/quickstart.mdx) for full setup.

## Install per framework

| Framework | Path | Install |
| --- | --- | --- |
| **ElizaOS** | `plugins/stacks/eliza` | Import `stacksPlugin` from `plugin-eliza-stacks` |
| **OpenClaw** | `plugins/stacks/openclaw` | `openclaw plugins install ./plugins/stacks/openclaw` |
| **Hermes** | `plugins/stacks/hermes` | Symlink or copy to `~/.hermes/plugins/stacks/` and enable in config |

## Tool surface

**33 tools** are defined in `@sugarhi11/agent-core`'s `STACKS_TOOLS` registry (17 read, 16 write). ElizaOS and Hermes expose these 33 tools. OpenClaw adds **`stacks_wallet_info`** for wallet/network status (34 tools total).

Logic is implemented once in `agent-core`. Eliza and OpenClaw import handlers from `@sugarhi11/agent-core`. Hermes delegates every tool call to the same handlers through `hermes/scripts/stacks-bridge.mjs`.

Browse the full tool reference in [docs/tools/overview.mdx](docs/tools/overview.mdx).

## Requirements

- **Node.js** 22+ (TypeScript plugins and Hermes bridge)
- **Python** 3.9+ (Hermes plugin runtime — no required pip packages)
- Public [Hiro API](https://docs.hiro.so/stacks/api) endpoints (no key required at default rate limits)

> **Warning:** Write tools move real funds on-chain. Test on **testnet** first and never expose private keys in prompts or logs.
