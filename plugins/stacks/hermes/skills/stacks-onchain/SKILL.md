# Stacks On-Chain Operations

Use the `stacks_*` tools for all Stacks blockchain interactions.

## Wallet defaults

- Network defaults to `STACKS_NETWORK` env (`testnet` if unset).
- Omit `address` on balance/history/stacking queries to use the agent wallet.
- Omit `senderKey` on write tools — it is injected from `STACKS_SENDER_KEY`.
- Never ask the user for a private key; configure signing server-side only.

## Amounts

Users speak in STX (e.g. `1 STX` = `1000000` microSTX). Convert before calling send/stack/delegate tools.

## Safety

- Confirm with the user before any write (send, stack, delegate, contract call, swap, bridge).
- Use read-only tools (`stacks_get_balance`, `stacks_read_only_call`, `stacks_resolve_name`) to verify state first.
- Load this skill explicitly via `skill_view("stacks:stacks-onchain")` when doing multi-step on-chain workflows.
