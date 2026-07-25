# @stacks/eve-stacks

eve extension that exposes Stacks blockchain tools via [`@sugarhi11/agent-core`](https://www.npmjs.com/package/@sugarhi11/agent-core).

## Install

```bash
cd plugins/stacks/eve
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
- `@sugarhi11/agent-core` (npm dependency)
- `eve` provided by the consuming agent (peer dependency)

## Windows note

`eve extension build` on Windows currently externalizes dependencies as absolute `C:\...` paths. This package runs `scripts/patch-eve-windows-imports.mjs` on `postinstall` / `prebuild` so those specifiers become valid `file://` URLs. Remove the script once upstream eve fixes the issue.
