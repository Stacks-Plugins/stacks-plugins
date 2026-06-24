export * from './types';
export * from './client';
export { formatSbtcAmount, parseSbtcAmount } from './utils/amounts';
export * from './tools/account';
export * from './tools/stacking';
export * from './tools/bns';
export * from './tools/contracts';
export * from './tools/swaps';
export * from './tools/bridge';
export * from './tools/sbtc';
export * from './tools/zest';
import { getBalance, sendTokens, getAccountHistory } from './tools/account';
import { getStackingStatus, canStack, stack, delegateStx, revokeDelegate, } from './tools/stacking';
import { resolveName, lookupAddress, getNamePrice, transferName, } from './tools/bns';
import { contractCall, readOnlyCall, decodeCv } from './tools/contracts';
import { swapQuote, swapExecute } from './tools/swaps';
import { bridgeQuote, bridgeInitiate } from './tools/bridge';
import { sbtcGetBalance, sendSbtc, sbtcBuildPegIn, sbtcInitiatePegIn, sbtcInitiatePegOut, sbtcGetPegStatus, } from './tools/sbtc';
import { zestSbtcVaultInfo, zestProtocolStatus, zestSupplySbtc, zestRedeemSbtc, zestPosition, zestCollateralAddSbtc, zestBorrow, zestRepay, } from './tools/zest';
/**
 * Canonical, framework-agnostic registry of every Stacks agent tool.
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
    {
        name: 'stacks_sbtc_get_balance',
        description: 'Get sBTC balance for a Stacks address (8-decimal base units).',
        handler: sbtcGetBalance,
        write: false,
    },
    {
        name: 'stacks_send_sbtc',
        description: 'Transfer sBTC on Stacks via the sbtc-token SIP-010 contract. Recipient must differ from sender (self-transfers fail post-conditions).',
        handler: sendSbtc,
        write: true,
    },
    {
        name: 'stacks_sbtc_build_peg_in',
        description: 'Build an sBTC peg-in deposit address and scripts without broadcasting Bitcoin.',
        handler: sbtcBuildPegIn,
        write: false,
    },
    {
        name: 'stacks_sbtc_initiate_peg_in',
        description: 'Peg BTC into sBTC: sign and broadcast a Bitcoin deposit tx and notify Emily. Requires BITCOIN_PRIVATE_KEY and BITCOIN_ADDRESS.',
        handler: sbtcInitiatePegIn,
        write: true,
        requiresBitcoinKey: true,
    },
    {
        name: 'stacks_sbtc_initiate_peg_out',
        description: 'Initiate sBTC peg-out (withdraw sBTC for BTC). Locks sBTC and creates a withdrawal request.',
        handler: sbtcInitiatePegOut,
        write: true,
    },
    {
        name: 'stacks_sbtc_get_peg_status',
        description: 'Query Emily for peg-in deposit status (bitcoinTxid) or peg-out withdrawals (stacksAddress).',
        handler: sbtcGetPegStatus,
        write: false,
    },
    {
        name: 'stacks_zest_sbtc_vault_info',
        description: 'Read Zest vault-sbtc utilization, borrow APR, and available liquidity.',
        handler: zestSbtcVaultInfo,
        write: false,
    },
    {
        name: 'stacks_zest_protocol_status',
        description: 'Read Zest vault pause flags before attempting writes.',
        handler: zestProtocolStatus,
        write: false,
    },
    {
        name: 'stacks_zest_supply_sbtc',
        description: 'Supply sBTC to Zest vault-sbtc to earn yield (receive zsBTC shares).',
        handler: zestSupplySbtc,
        write: true,
    },
    {
        name: 'stacks_zest_redeem_sbtc',
        description: 'Redeem zsBTC shares from Zest vault-sbtc back to sBTC.',
        handler: zestRedeemSbtc,
        write: true,
    },
    {
        name: 'stacks_zest_position',
        description: 'Read a Zest market position (collateral and debt) for a Stacks address.',
        handler: zestPosition,
        write: false,
    },
    {
        name: 'stacks_zest_collateral_add_sbtc',
        description: 'Post sBTC as collateral on Zest market for borrowing.',
        handler: zestCollateralAddSbtc,
        write: true,
    },
    {
        name: 'stacks_zest_borrow',
        description: 'Borrow an asset from Zest market against posted collateral.',
        handler: zestBorrow,
        write: true,
    },
    {
        name: 'stacks_zest_repay',
        description: 'Repay borrowed debt on Zest market.',
        handler: zestRepay,
        write: true,
    },
];
