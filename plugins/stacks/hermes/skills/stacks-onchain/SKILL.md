# Stacks On-Chain Operations

Use the `stacks_*` tools for all Stacks blockchain interactions.

## Wallet defaults

- Network defaults to `STACKS_NETWORK` env (`testnet` if unset).
- Omit `address` on balance/history/stacking/sBTC/Zest queries to use the agent wallet.
- Omit `senderKey` on write tools — it is injected from `STACKS_SENDER_KEY`.
- Never ask the user for a private key; configure signing server-side only.

## Amounts

- **STX**: users speak in STX (e.g. `1 STX` = `1000000` microSTX). Convert before calling send/stack/delegate tools.
- **sBTC**: 8 decimals (satoshis). Human amounts like `0.001 sBTC` or `10000 sats` are accepted by handlers.

## sBTC peg-in / peg-out

- **Peg-in** (`stacks_sbtc_initiate_peg_in`) spends real BTC. Requires `BITCOIN_PRIVATE_KEY` and `BITCOIN_ADDRESS` in server env.
- Build-only preview: `stacks_sbtc_build_peg_in` returns deposit address without broadcasting.
- **Peg-out** is async; poll with `stacks_sbtc_get_peg_status` after `stacks_sbtc_initiate_peg_out`.
- Confirm amounts and destination addresses before any peg operation.

## Zest Protocol

- Call `stacks_zest_protocol_status` before supply, redeem, collateral, borrow, or repay writes.
- Zest mainnet has had pauses; refuse writes when pause flags are set.
- Borrow/repay may require Pyth `priceFeedsHex` when on-chain prices are stale.
- Liquidation risk applies to borrowed positions; warn users before borrowing.

## Safety

- Confirm with the user before any write (send, stack, delegate, contract call, swap, bridge, sBTC, Zest).
- Use read-only tools (`stacks_get_balance`, `stacks_sbtc_get_balance`, `stacks_zest_protocol_status`) to verify state first.
- Load this skill explicitly via `skill_view("stacks:stacks-onchain")` when doing multi-step on-chain workflows.
