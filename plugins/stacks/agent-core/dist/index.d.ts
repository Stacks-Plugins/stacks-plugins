export * from './types';
export * from './client';
export * from './tools/account';
export * from './tools/stacking';
export * from './tools/bns';
export * from './tools/contracts';
export * from './tools/swaps';
export * from './tools/bridge';
import { getBalance, sendTokens, getAccountHistory } from './tools/account';
import { getStackingStatus, canStack, stack, delegateStx, revokeDelegate } from './tools/stacking';
import { resolveName, lookupAddress, getNamePrice, transferName } from './tools/bns';
import { contractCall, readOnlyCall, decodeCv } from './tools/contracts';
import { swapQuote, swapExecute } from './tools/swaps';
import { bridgeQuote, bridgeInitiate } from './tools/bridge';
export declare const STACKS_TOOLS: readonly [{
    readonly name: "stacks_get_balance";
    readonly description: "Get STX, fungible, and non-fungible token balances for a Stacks address.";
    readonly handler: typeof getBalance;
    readonly write: false;
}, {
    readonly name: "stacks_send_tokens";
    readonly description: "Sign and broadcast an STX transfer. Requires a sender private key.";
    readonly handler: typeof sendTokens;
    readonly write: true;
}, {
    readonly name: "stacks_get_account_history";
    readonly description: "Get paginated transaction history for a Stacks address.";
    readonly handler: typeof getAccountHistory;
    readonly write: false;
}, {
    readonly name: "stacks_stacking_status";
    readonly description: "Get the current stacking (PoX) lock and delegation status for an address.";
    readonly handler: typeof getStackingStatus;
    readonly write: false;
}, {
    readonly name: "stacks_can_stack";
    readonly description: "Check whether an address is eligible to stack a given amount and cycle count.";
    readonly handler: typeof canStack;
    readonly write: false;
}, {
    readonly name: "stacks_stack";
    readonly description: "Lock STX for stacking (PoX). Requires a sender private key.";
    readonly handler: typeof stack;
    readonly write: true;
}, {
    readonly name: "stacks_delegate_stx";
    readonly description: "Delegate STX to a stacking pool/operator. Requires a sender private key.";
    readonly handler: typeof delegateStx;
    readonly write: true;
}, {
    readonly name: "stacks_revoke_delegate";
    readonly description: "Revoke an active stacking delegation. Requires a sender private key.";
    readonly handler: typeof revokeDelegate;
    readonly write: true;
}, {
    readonly name: "stacks_resolve_name";
    readonly description: "Resolve a BNS name to its owner address and zonefile.";
    readonly handler: typeof resolveName;
    readonly write: false;
}, {
    readonly name: "stacks_lookup_address";
    readonly description: "List all BNS names owned by a Stacks address.";
    readonly handler: typeof lookupAddress;
    readonly write: false;
}, {
    readonly name: "stacks_get_name_price";
    readonly description: "Get the registration price (microSTX) for a BNS name.";
    readonly handler: typeof getNamePrice;
    readonly write: false;
}, {
    readonly name: "stacks_transfer_name";
    readonly description: "Transfer ownership of a BNS name to another address. Requires a sender key.";
    readonly handler: typeof transferName;
    readonly write: true;
}, {
    readonly name: "stacks_contract_call";
    readonly description: "Sign and broadcast a public Clarity contract function call.";
    readonly handler: typeof contractCall;
    readonly write: true;
}, {
    readonly name: "stacks_read_only_call";
    readonly description: "Evaluate a read-only Clarity contract function and return decoded JSON.";
    readonly handler: typeof readOnlyCall;
    readonly write: false;
}, {
    readonly name: "stacks_decode_cv";
    readonly description: "Decode a hex-encoded serialized Clarity value into readable JSON.";
    readonly handler: typeof decodeCv;
    readonly write: false;
}, {
    readonly name: "stacks_swap_quote";
    readonly description: "Get a token swap quote from the ALEX DEX (mainnet).";
    readonly handler: typeof swapQuote;
    readonly write: false;
}, {
    readonly name: "stacks_swap_execute";
    readonly description: "Execute a token swap on the ALEX DEX. Requires a sender key and encoded route.";
    readonly handler: typeof swapExecute;
    readonly write: true;
}, {
    readonly name: "stacks_bridge_quote";
    readonly description: "Get a cross-chain bridge quote via Allbridge Core.";
    readonly handler: typeof bridgeQuote;
    readonly write: false;
}, {
    readonly name: "stacks_bridge_initiate";
    readonly description: "Initiate a cross-chain bridge transfer (guided; see tool notes).";
    readonly handler: typeof bridgeInitiate;
    readonly write: true;
}];
export type StacksToolName = (typeof STACKS_TOOLS)[number]['name'];
