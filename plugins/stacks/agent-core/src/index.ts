export * from './types';
export * from './client';

export * from './tools/account';
export * from './tools/stacking';
export * from './tools/bns';
export * from './tools/contracts';
export * from './tools/swaps';
export * from './tools/bridge';

import { getBalance, sendTokens, getAccountHistory } from './tools/account';
import {
  getStackingStatus,
  canStack,
  stack,
  delegateStx,
  revokeDelegate,
} from './tools/stacking';
import {
  resolveName,
  lookupAddress,
  getNamePrice,
  transferName,
} from './tools/bns';
import { contractCall, readOnlyCall, decodeCv } from './tools/contracts';
import { swapQuote, swapExecute } from './tools/swaps';
import { bridgeQuote, bridgeInitiate } from './tools/bridge';

/**
 * Canonical, framework-agnostic registry of every Stacks agent tool.
 *
 * Each entry has a stable `name` (used as the tool id across ElizaOS, OpenClaw,
 * and Hermes), a human description, and the implementation `handler`. Plugin
 * adapters iterate this list (or import handlers directly) so the three
 * ecosystems stay in sync from a single source of truth.
 */
export const STACKS_TOOLS = [
  {
    name: 'stacks_get_balance',
    description: 'Get STX, fungible, and non-fungible token balances for a Stacks address.',
    handler: getBalance,
    write: false,
  },
  {
    name: 'stacks_send_tokens',
    description: 'Sign and broadcast an STX transfer. Requires a sender private key.',
    handler: sendTokens,
    write: true,
  },
  {
    name: 'stacks_get_account_history',
    description: 'Get paginated transaction history for a Stacks address.',
    handler: getAccountHistory,
    write: false,
  },
  {
    name: 'stacks_stacking_status',
    description: 'Get the current stacking (PoX) lock and delegation status for an address.',
    handler: getStackingStatus,
    write: false,
  },
  {
    name: 'stacks_can_stack',
    description: 'Check whether an address is eligible to stack a given amount and cycle count.',
    handler: canStack,
    write: false,
  },
  {
    name: 'stacks_stack',
    description: 'Lock STX for stacking (PoX). Requires a sender private key.',
    handler: stack,
    write: true,
  },
  {
    name: 'stacks_delegate_stx',
    description: 'Delegate STX to a stacking pool/operator. Requires a sender private key.',
    handler: delegateStx,
    write: true,
  },
  {
    name: 'stacks_revoke_delegate',
    description: 'Revoke an active stacking delegation. Requires a sender private key.',
    handler: revokeDelegate,
    write: true,
  },
  {
    name: 'stacks_resolve_name',
    description: 'Resolve a BNS name to its owner address and zonefile.',
    handler: resolveName,
    write: false,
  },
  {
    name: 'stacks_lookup_address',
    description: 'List all BNS names owned by a Stacks address.',
    handler: lookupAddress,
    write: false,
  },
  {
    name: 'stacks_get_name_price',
    description: 'Get the registration price (microSTX) for a BNS name.',
    handler: getNamePrice,
    write: false,
  },
  {
    name: 'stacks_transfer_name',
    description: 'Transfer ownership of a BNS name to another address. Requires a sender key.',
    handler: transferName,
    write: true,
  },
  {
    name: 'stacks_contract_call',
    description: 'Sign and broadcast a public Clarity contract function call.',
    handler: contractCall,
    write: true,
  },
  {
    name: 'stacks_read_only_call',
    description: 'Evaluate a read-only Clarity contract function and return decoded JSON.',
    handler: readOnlyCall,
    write: false,
  },
  {
    name: 'stacks_decode_cv',
    description: 'Decode a hex-encoded serialized Clarity value into readable JSON.',
    handler: decodeCv,
    write: false,
  },
  {
    name: 'stacks_swap_quote',
    description: 'Get a token swap quote from the ALEX DEX (mainnet).',
    handler: swapQuote,
    write: false,
  },
  {
    name: 'stacks_swap_execute',
    description: 'Execute a token swap on the ALEX DEX. Requires a sender key and encoded route.',
    handler: swapExecute,
    write: true,
  },
  {
    name: 'stacks_bridge_quote',
    description: 'Get a cross-chain bridge quote via Allbridge Core.',
    handler: bridgeQuote,
    write: false,
  },
  {
    name: 'stacks_bridge_initiate',
    description: 'Initiate a cross-chain bridge transfer (guided; see tool notes).',
    handler: bridgeInitiate,
    write: true,
  },
] as const;

export type StacksToolName = (typeof STACKS_TOOLS)[number]['name'];
