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
exports.STACKS_TOOLS = exports.parseSbtcAmount = exports.formatSbtcAmount = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./client"), exports);
var amounts_1 = require("./utils/amounts");
Object.defineProperty(exports, "formatSbtcAmount", { enumerable: true, get: function () { return amounts_1.formatSbtcAmount; } });
Object.defineProperty(exports, "parseSbtcAmount", { enumerable: true, get: function () { return amounts_1.parseSbtcAmount; } });
__exportStar(require("./tools/account"), exports);
__exportStar(require("./tools/stacking"), exports);
__exportStar(require("./tools/bns"), exports);
__exportStar(require("./tools/contracts"), exports);
__exportStar(require("./tools/swaps"), exports);
__exportStar(require("./tools/bridge"), exports);
__exportStar(require("./tools/sbtc"), exports);
__exportStar(require("./tools/zest"), exports);
const account_1 = require("./tools/account");
const stacking_1 = require("./tools/stacking");
const bns_1 = require("./tools/bns");
const contracts_1 = require("./tools/contracts");
const swaps_1 = require("./tools/swaps");
const bridge_1 = require("./tools/bridge");
const sbtc_1 = require("./tools/sbtc");
const zest_1 = require("./tools/zest");
/**
 * Canonical, framework-agnostic registry of every Stacks agent tool.
 */
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
    {
        name: 'stacks_sbtc_get_balance',
        description: 'Get sBTC balance for a Stacks address (8-decimal base units).',
        handler: sbtc_1.sbtcGetBalance,
        write: false,
    },
    {
        name: 'stacks_send_sbtc',
        description: 'Transfer sBTC on Stacks via the sbtc-token SIP-010 contract. Recipient must differ from sender (self-transfers fail post-conditions).',
        handler: sbtc_1.sendSbtc,
        write: true,
    },
    {
        name: 'stacks_sbtc_build_peg_in',
        description: 'Build an sBTC peg-in deposit address and scripts without broadcasting Bitcoin.',
        handler: sbtc_1.sbtcBuildPegIn,
        write: false,
    },
    {
        name: 'stacks_sbtc_initiate_peg_in',
        description: 'Peg BTC into sBTC: sign and broadcast a Bitcoin deposit tx and notify Emily. Requires BITCOIN_PRIVATE_KEY and BITCOIN_ADDRESS.',
        handler: sbtc_1.sbtcInitiatePegIn,
        write: true,
        requiresBitcoinKey: true,
    },
    {
        name: 'stacks_sbtc_initiate_peg_out',
        description: 'Initiate sBTC peg-out (withdraw sBTC for BTC). Locks sBTC and creates a withdrawal request.',
        handler: sbtc_1.sbtcInitiatePegOut,
        write: true,
    },
    {
        name: 'stacks_sbtc_get_peg_status',
        description: 'Query Emily for peg-in deposit status (bitcoinTxid) or peg-out withdrawals (stacksAddress).',
        handler: sbtc_1.sbtcGetPegStatus,
        write: false,
    },
    {
        name: 'stacks_zest_sbtc_vault_info',
        description: 'Read Zest vault-sbtc utilization, borrow APR, and available liquidity.',
        handler: zest_1.zestSbtcVaultInfo,
        write: false,
    },
    {
        name: 'stacks_zest_protocol_status',
        description: 'Read Zest vault pause flags before attempting writes.',
        handler: zest_1.zestProtocolStatus,
        write: false,
    },
    {
        name: 'stacks_zest_supply_sbtc',
        description: 'Supply sBTC to Zest vault-sbtc to earn yield (receive zsBTC shares).',
        handler: zest_1.zestSupplySbtc,
        write: true,
    },
    {
        name: 'stacks_zest_redeem_sbtc',
        description: 'Redeem zsBTC shares from Zest vault-sbtc back to sBTC.',
        handler: zest_1.zestRedeemSbtc,
        write: true,
    },
    {
        name: 'stacks_zest_position',
        description: 'Read a Zest market position (collateral and debt) for a Stacks address.',
        handler: zest_1.zestPosition,
        write: false,
    },
    {
        name: 'stacks_zest_collateral_add_sbtc',
        description: 'Post sBTC as collateral on Zest market for borrowing.',
        handler: zest_1.zestCollateralAddSbtc,
        write: true,
    },
    {
        name: 'stacks_zest_borrow',
        description: 'Borrow an asset from Zest market against posted collateral.',
        handler: zest_1.zestBorrow,
        write: true,
    },
    {
        name: 'stacks_zest_repay',
        description: 'Repay borrowed debt on Zest market.',
        handler: zest_1.zestRepay,
        write: true,
    },
];
