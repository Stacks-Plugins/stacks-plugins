# @stacks/eve-stacks

eve extension that exposes Stacks blockchain tools via [`@stacks/agent-core`](../agent-core).

## Install

```bash
# From this package (after building agent-core)
npm run build -w @stacks/agent-core   # if using a workspace root
cd plugins/stacks/agent-core && npm run build && cd ../eve
npm install
npm run build
```

In a consuming eve agent:

```bash
pnpm add @stacks/eve-stacks
# or for a local monorepo path:
pnpm add ../path/to/plugins/stacks/eve
```

## Mount

```ts
// agent/extensions/stacks.ts
import stacks from "@stacks/eve-stacks";

export default stacks({
  defaultNetwork: (process.env.STACKS_NETWORK as "mainnet" | "testnet") ?? "testnet",
  senderKey: process.env.STACKS_SENDER_KEY,
});
```

Mounted tools use the eve namespace prefix: `get_balance.ts` → `stacks__get_balance`.

## Requirements

- Node.js 24+
- Built `@stacks/agent-core`
- `eve` provided by the consuming agent (peer dependency)

## Windows note

`eve extension build` on Windows currently externalizes dependencies as absolute `C:\...` paths. This package runs `scripts/patch-eve-windows-imports.mjs` on `postinstall` / `prebuild` so those specifiers become valid `file://` URLs. Remove the script once upstream eve fixes the issue.
