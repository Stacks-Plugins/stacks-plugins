"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STACKS_TOOLS = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./client"), exports);
__exportStar(require("./tools/account"), exports);
__exportStar(require("./tools/stacking"), exports);
__exportStar(require("./tools/bns"), exports);
__exportStar(require("./tools/contracts"), exports);
__exportStar(require("./tools/swaps"), exports);
__exportStar(require("./tools/bridge"), exports);
const account_1 = require("./tools/account");
const stacking_1 = require("./tools/stacking");
const bns_1 = require("./tools/bns");
const contracts_1 = require("./tools/contracts");
const swaps_1 = require("./tools/swaps");
const bridge_1 = require("./tools/bridge");
exports.STACKS_TOOLS = [
    {
        name: 'stacks_get_balance',
        description: 'Get STX, fungible, and non-fungible token balances for a Stacks address.',
        handler: account_1.getBalance,
        write: false,
    },
    {
        name: 'stacks_send_tokens',
        description: 'Sign and broadcast an STX transfer. Requires a sender private key.',
        handler: account_1.sendTokens,
        write: true,
    },
    {
        name: 'stacks_get_account_history',
        description: 'Get paginated transaction history for a Stacks address.',
        handler: account_1.getAccountHistory,
        write: false,
    },
    {
        name: 'stacks_stacking_status',
        description: 'Get the current stacking (PoX) lock and delegation status for an address.',
        handler: stacking_1.getStackingStatus,
        write: false,
    },
    {
        name: 'stacks_can_stack',
        description: 'Check whether an address is eligible to stack a given amount and cycle count.',
        handler: stacking_1.canStack,
        write: false,
    },
    {
        name: 'stacks_stack',
        description: 'Lock STX for stacking (PoX). Requires a sender private key.',
        handler: stacking_1.stack,
        write: true,
    },
    {
        name: 'stacks_delegate_stx',
        description: 'Delegate STX to a stacking pool/operator. Requires a sender private key.',
        handler: stacking_1.delegateStx,
        write: true,
    },
    {
        name: 'stacks_revoke_delegate',
        description: 'Revoke an active stacking delegation. Requires a sender private key.',
        handler: stacking_1.revokeDelegate,
        write: true,
    },
    {
        name: 'stacks_resolve_name',
        description: 'Resolve a BNS name to its owner address and zonefile.',
        handler: bns_1.resolveName,
        write: false,
    },
    {
        name: 'stacks_lookup_address',
        description: 'List all BNS names owned by a Stacks address.',
        handler: bns_1.lookupAddress,
        write: false,
    },
    {
        name: 'stacks_get_name_price',
        description: 'Get the registration price (microSTX) for a BNS name.',
        handler: bns_1.getNamePrice,
        write: false,
    },
    {
        name: 'stacks_transfer_name',
        description: 'Transfer ownership of a BNS name to another address. Requires a sender key.',
        handler: bns_1.transferName,
        write: true,
    },
    {
        name: 'stacks_contract_call',
        description: 'Sign and broadcast a public Clarity contract function call.',
        handler: contracts_1.contractCall,
        write: true,
    },
    {
        name: 'stacks_read_only_call',
        description: 'Evaluate a read-only Clarity contract function and return decoded JSON.',
        handler: contracts_1.readOnlyCall,
        write: false,
    },
    {
        name: 'stacks_decode_cv',
        description: 'Decode a hex-encoded serialized Clarity value into readable JSON.',
        handler: contracts_1.decodeCv,
        write: false,
    },
    {
        name: 'stacks_swap_quote',
        description: 'Get a token swap quote from the ALEX DEX (mainnet).',
        handler: swaps_1.swapQuote,
        write: false,
    },
    {
        name: 'stacks_swap_execute',
        description: 'Execute a token swap on the ALEX DEX. Requires a sender key and encoded route.',
        handler: swaps_1.swapExecute,
        write: true,
    },
    {
        name: 'stacks_bridge_quote',
        description: 'Get a cross-chain bridge quote via Allbridge Core.',
        handler: bridge_1.bridgeQuote,
        write: false,
    },
    {
        name: 'stacks_bridge_initiate',
        description: 'Initiate a cross-chain bridge transfer (guided; see tool notes).',
        handler: bridge_1.bridgeInitiate,
        write: true,
    },
];
//# sourceMappingURL=index.js.map