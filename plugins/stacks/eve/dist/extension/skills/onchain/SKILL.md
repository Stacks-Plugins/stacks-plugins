---
name: onchain
description: Multi-step Stacks on-chain workflows (balance, send, stacking, BNS, contracts, swaps, bridge).
---

# Stacks On-Chain Operations

Use the `stacks__*` tools for all Stacks blockchain interactions when this extension is mounted as `stacks`.

## Wallet defaults

- Network defaults to the extension `defaultNetwork` (often from `STACKS_NETWORK`).
- Omit `senderKey` on write tools — it is injected from the extension mount config (`STACKS_SENDER_KEY`).
- Never ask the user for a private key; configure signing server-side only.

## Amounts

Users speak in STX (e.g. `1 STX` = `1000000` microSTX). Convert before calling send/stack/delegate tools.

## Safety

- Confirm with the user before any write (send, stack, delegate, contract call, swap, bridge).
- Use read-only tools (`stacks__get_balance`, `stacks__read_only_call`, `stacks__resolve_name`) to verify state first.
- Write tools are gated with human approval in eve.

## Common tool ids (mount namespace `stacks`)

| Tool | Purpose |
| --- | --- |
| `stacks__get_balance` | Balances for an address |
| `stacks__send_tokens` | STX transfer |
| `stacks__get_account_history` | Transaction history |
| `stacks__stacking_status` | PoX lock / delegation status |
| `stacks__can_stack` | Stacking eligibility |
| `stacks__stack` | Lock STX for stacking |
| `stacks__delegate_stx` | Delegate to a pool |
| `stacks__revoke_delegate` | Revoke delegation |
| `stacks__resolve_name` | BNS name → address |
| `stacks__lookup_address` | Address → BNS names |
| `stacks__get_name_price` | BNS registration price |
| `stacks__transfer_name` | Transfer BNS name |
| `stacks__contract_call` | Public Clarity call |
| `stacks__read_only_call` | Read-only Clarity call |
| `stacks__decode_cv` | Decode Clarity hex |
| `stacks__swap_quote` | ALEX swap quote |
| `stacks__swap_execute` | ALEX swap execute |
| `stacks__bridge_quote` | Allbridge quote |
| `stacks__bridge_initiate` | Allbridge initiate |
