import { Type } from 'typebox';
import { bridgeInitiate, bridgeQuote, canStack, contractCall, decodeCv, delegateStx, getAccountHistory, getBalance, getNamePrice, getStackingStatus, lookupAddress, readOnlyCall, resolveName, revokeDelegate, sbtcBuildPegIn, sbtcGetBalance, sbtcGetPegStatus, sbtcInitiatePegIn, sbtcInitiatePegOut, sendSbtc, sendTokens, stack, swapExecute, swapQuote, transferName, zestBorrow, zestCollateralAddSbtc, zestPosition, zestProtocolStatus, zestRedeemSbtc, zestRepay, zestSbtcVaultInfo, zestSupplySbtc, } from '@sugarhi11/agent-core';
const Network = Type.Optional(Type.Union([Type.Literal('mainnet'), Type.Literal('testnet')], {
    description: 'Target network. Defaults to STACKS_NETWORK env or plugin config.',
}));
const Amount = Type.Union([Type.String(), Type.Number()]);
const HexArgs = Type.Optional(Type.Array(Type.String(), {
    description: 'Clarity function args as hex-encoded serialized ClarityValues.',
}));
export const stacksToolSpecs = [
    {
        name: 'stacks_get_balance',
        description: 'Look up STX and token balances on Stacks. Use when the user asks about balance, ' +
            'how much STX they have, or wallet funds. Omit `address` to check the agent wallet. ' +
            'Params: { address?: string, network?: "mainnet"|"testnet" }.',
        parameters: Type.Object({
            address: Type.Optional(Type.String()),
            network: Network,
        }),
        handler: getBalance,
    },
    {
        name: 'stacks_send_tokens',
        description: 'Send STX to another Stacks address. Use when the user wants to transfer, send, or pay STX. ' +
            'Confirm recipient and amount before sending. Amount can be in STX (e.g. "1" or "0.5") — converted automatically. ' +
            'Omit `senderKey` (injected from env). Params: { recipient: string, amount: string|number, memo?: string, network? }.',
        parameters: Type.Object({
            recipient: Type.String(),
            amount: Amount,
            memo: Type.Optional(Type.String()),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: sendTokens,
        signed: true,
        parseAmount: true,
        optional: true,
    },
    {
        name: 'stacks_get_account_history',
        description: 'Fetch recent transactions for a Stacks address. Use when the user asks for history, ' +
            'past transfers, or activity. Omit `address` for the agent wallet. ' +
            'Params: { address?: string, limit?: number, offset?: number, network? }.',
        parameters: Type.Object({
            address: Type.Optional(Type.String()),
            limit: Type.Optional(Type.Number()),
            offset: Type.Optional(Type.Number()),
            network: Network,
        }),
        handler: getAccountHistory,
    },
    {
        name: 'stacks_stacking_status',
        description: 'Get the current stacking (PoX) lock and delegation status for an address. ' +
            'Params: { address?: string, network? }.',
        parameters: Type.Object({
            address: Type.Optional(Type.String()),
            network: Network,
        }),
        handler: getStackingStatus,
    },
    {
        name: 'stacks_can_stack',
        description: 'Check whether an address can stack a given amount for a number of cycles. ' +
            'Params: { address, amount, cycles, poxAddress, network? }.',
        parameters: Type.Object({
            address: Type.String(),
            amount: Amount,
            cycles: Type.Number(),
            poxAddress: Type.String(),
            network: Network,
        }),
        handler: canStack,
        parseAmount: true,
    },
    {
        name: 'stacks_stack',
        description: 'Lock STX for stacking (PoX). ' +
            'Params: { amount, cycles, poxAddress, burnBlockHeight?, network? }. senderKey is auto-injected.',
        parameters: Type.Object({
            amount: Amount,
            cycles: Type.Number(),
            poxAddress: Type.String(),
            burnBlockHeight: Type.Optional(Type.Number()),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: stack,
        signed: true,
        parseAmount: true,
        optional: true,
    },
    {
        name: 'stacks_delegate_stx',
        description: 'Delegate STX to a stacking pool/operator. ' +
            'Params: { amount, delegateTo, untilBurnBlockHeight?, poxAddress?, network? }. senderKey is auto-injected.',
        parameters: Type.Object({
            amount: Amount,
            delegateTo: Type.String(),
            untilBurnBlockHeight: Type.Optional(Type.Number()),
            poxAddress: Type.Optional(Type.String()),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: delegateStx,
        signed: true,
        parseAmount: true,
        optional: true,
    },
    {
        name: 'stacks_revoke_delegate',
        description: 'Revoke an active stacking delegation. senderKey is auto-injected. Params: { network? }.',
        parameters: Type.Object({
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: revokeDelegate,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_resolve_name',
        description: 'Resolve a BNS name to its owner address and zonefile. Params: { name: string, network? }.',
        parameters: Type.Object({ name: Type.String(), network: Network }),
        handler: resolveName,
    },
    {
        name: 'stacks_lookup_address',
        description: 'List all BNS names owned by a Stacks address. Params: { address: string, network? }.',
        parameters: Type.Object({ address: Type.String(), network: Network }),
        handler: lookupAddress,
    },
    {
        name: 'stacks_get_name_price',
        description: 'Get the registration price (microSTX) for a BNS name. Params: { name: string, network? }.',
        parameters: Type.Object({ name: Type.String(), network: Network }),
        handler: getNamePrice,
    },
    {
        name: 'stacks_transfer_name',
        description: 'Transfer ownership of a BNS name to another address. ' +
            'Params: { name, newOwnerAddress, zonefile?, network? }. senderKey is auto-injected.',
        parameters: Type.Object({
            name: Type.String(),
            newOwnerAddress: Type.String(),
            zonefile: Type.Optional(Type.String()),
            network: Network,
        }),
        handler: transferName,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_contract_call',
        description: 'Sign and broadcast a public Clarity contract function call. ' +
            'Params: { contractAddress, contractName, functionName, functionArgsHex?, network? }. senderKey is auto-injected.',
        parameters: Type.Object({
            contractAddress: Type.String(),
            contractName: Type.String(),
            functionName: Type.String(),
            functionArgsHex: HexArgs,
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: contractCall,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_read_only_call',
        description: 'Evaluate a read-only Clarity contract function. ' +
            'Params: { contractAddress, contractName, functionName, functionArgsHex?, senderAddress?, network? }.',
        parameters: Type.Object({
            contractAddress: Type.String(),
            contractName: Type.String(),
            functionName: Type.String(),
            functionArgsHex: HexArgs,
            senderAddress: Type.Optional(Type.String()),
            network: Network,
        }),
        handler: readOnlyCall,
    },
    {
        name: 'stacks_decode_cv',
        description: 'Decode a hex-encoded serialized Clarity value into readable JSON. Params: { hex: string }.',
        parameters: Type.Object({ hex: Type.String() }),
        handler: decodeCv,
    },
    {
        name: 'stacks_swap_quote',
        description: 'Get a token swap quote from the ALEX DEX (mainnet). ' +
            'Params: { tokenFrom, tokenTo, amount }.',
        parameters: Type.Object({
            tokenFrom: Type.String(),
            tokenTo: Type.String(),
            amount: Amount,
            network: Network,
        }),
        handler: swapQuote,
    },
    {
        name: 'stacks_swap_execute',
        description: 'Execute a token swap on the ALEX DEX. ' +
            'Params: { tokenFrom, tokenTo, amount, minAmountOut, functionArgsHex? }. senderKey is auto-injected.',
        parameters: Type.Object({
            tokenFrom: Type.String(),
            tokenTo: Type.String(),
            amount: Amount,
            minAmountOut: Amount,
            functionArgsHex: HexArgs,
            functionName: Type.Optional(Type.String()),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: swapExecute,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_bridge_quote',
        description: 'Get a cross-chain bridge quote via Allbridge Core. ' +
            'Params: { fromChain, toChain, token, amount }.',
        parameters: Type.Object({
            fromChain: Type.String(),
            toChain: Type.String(),
            token: Type.String(),
            amount: Amount,
        }),
        handler: bridgeQuote,
    },
    {
        name: 'stacks_bridge_initiate',
        description: 'Initiate a cross-chain bridge transfer (guided). ' +
            'Params: { fromChain, toChain, token, amount, recipient }. senderKey is auto-injected.',
        parameters: Type.Object({
            fromChain: Type.String(),
            toChain: Type.String(),
            token: Type.String(),
            amount: Amount,
            recipient: Type.String(),
            network: Network,
        }),
        handler: bridgeInitiate,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_sbtc_get_balance',
        description: 'Get sBTC balance for a Stacks address (8-decimal base units). Omit `address` for the agent wallet. ' +
            'Params: { address?: string, network? }.',
        parameters: Type.Object({
            address: Type.Optional(Type.String()),
            network: Network,
        }),
        handler: sbtcGetBalance,
    },
    {
        name: 'stacks_send_sbtc',
        description: 'Transfer sBTC on Stacks via sbtc-token SIP-010. Recipient must differ from sender (no self-transfers). Confirm recipient and amount. senderKey auto-injected. ' +
            'Params: { recipient, amount, memo?, network? }.',
        parameters: Type.Object({
            recipient: Type.String(),
            amount: Amount,
            memo: Type.Optional(Type.String()),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: sendSbtc,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_sbtc_build_peg_in',
        description: 'Build sBTC peg-in deposit address and scripts without broadcasting Bitcoin. ' +
            'Params: { stacksAddress?, maxSignerFee?, reclaimLockTime?, network? }.',
        parameters: Type.Object({
            stacksAddress: Type.Optional(Type.String()),
            maxSignerFee: Type.Optional(Type.Number()),
            reclaimLockTime: Type.Optional(Type.Number()),
            network: Network,
        }),
        handler: sbtcBuildPegIn,
    },
    {
        name: 'stacks_sbtc_initiate_peg_in',
        description: 'Peg BTC into sBTC: broadcast Bitcoin deposit and notify Emily. Requires BITCOIN_PRIVATE_KEY and BITCOIN_ADDRESS. ' +
            'Params: { amount, stacksAddress?, feeRate?, maxSignerFee?, network? }.',
        parameters: Type.Object({
            amount: Amount,
            stacksAddress: Type.Optional(Type.String()),
            feeRate: Type.Optional(Type.Number()),
            maxSignerFee: Type.Optional(Type.Number()),
            reclaimLockTime: Type.Optional(Type.Number()),
            network: Network,
        }),
        handler: sbtcInitiatePegIn,
        optional: true,
    },
    {
        name: 'stacks_sbtc_initiate_peg_out',
        description: 'Initiate sBTC peg-out (withdraw sBTC for BTC). senderKey auto-injected. ' +
            'Params: { amount, bitcoinRecipient, maxFee?, network? }.',
        parameters: Type.Object({
            amount: Amount,
            bitcoinRecipient: Type.String(),
            maxFee: Type.Optional(Amount),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: sbtcInitiatePegOut,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_sbtc_get_peg_status',
        description: 'Query Emily for peg-in deposit (bitcoinTxid) or peg-out withdrawals (stacksAddress). ' +
            'Params: { bitcoinTxid?, vout?, stacksAddress?, network? }.',
        parameters: Type.Object({
            bitcoinTxid: Type.Optional(Type.String()),
            vout: Type.Optional(Type.Number()),
            stacksAddress: Type.Optional(Type.String()),
            network: Network,
        }),
        handler: sbtcGetPegStatus,
    },
    {
        name: 'stacks_zest_sbtc_vault_info',
        description: 'Read Zest vault-sbtc utilization, borrow APR, and available liquidity. Params: { network? }.',
        parameters: Type.Object({ network: Network }),
        handler: zestSbtcVaultInfo,
    },
    {
        name: 'stacks_zest_protocol_status',
        description: 'Read Zest vault pause flags before attempting writes. Params: { network? }.',
        parameters: Type.Object({ network: Network }),
        handler: zestProtocolStatus,
    },
    {
        name: 'stacks_zest_supply_sbtc',
        description: 'Supply sBTC to Zest vault-sbtc for yield (receive zsBTC). Check pause state first. senderKey auto-injected. ' +
            'Params: { amount, minOut?, recipient?, network? }.',
        parameters: Type.Object({
            amount: Amount,
            minOut: Type.Optional(Amount),
            recipient: Type.Optional(Type.String()),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: zestSupplySbtc,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_zest_redeem_sbtc',
        description: 'Redeem zsBTC shares from Zest vault-sbtc. senderKey auto-injected. ' +
            'Params: { shares, minUnderlying?, recipient?, network? }.',
        parameters: Type.Object({
            shares: Amount,
            minUnderlying: Type.Optional(Amount),
            recipient: Type.Optional(Type.String()),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: zestRedeemSbtc,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_zest_position',
        description: 'Read Zest market position (collateral and debt) for a Stacks address. Params: { address?, network? }.',
        parameters: Type.Object({
            address: Type.Optional(Type.String()),
            network: Network,
        }),
        handler: zestPosition,
    },
    {
        name: 'stacks_zest_collateral_add_sbtc',
        description: 'Post sBTC as Zest market collateral. senderKey auto-injected. ' +
            'Params: { amount, assetContract?, priceFeedsHex?, network? }.',
        parameters: Type.Object({
            amount: Amount,
            assetContract: Type.Optional(Type.String()),
            priceFeedsHex: Type.Optional(Type.Array(Type.String())),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: zestCollateralAddSbtc,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_zest_borrow',
        description: 'Borrow from Zest market against collateral. senderKey auto-injected. ' +
            'Params: { assetContract, amount, receiver?, priceFeedsHex?, network? }.',
        parameters: Type.Object({
            assetContract: Type.String(),
            amount: Amount,
            receiver: Type.Optional(Type.String()),
            priceFeedsHex: Type.Optional(Type.Array(Type.String())),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: zestBorrow,
        signed: true,
        optional: true,
    },
    {
        name: 'stacks_zest_repay',
        description: 'Repay Zest market debt. senderKey auto-injected. ' +
            'Params: { assetContract, amount, priceFeedsHex?, network? }.',
        parameters: Type.Object({
            assetContract: Type.String(),
            amount: Amount,
            priceFeedsHex: Type.Optional(Type.Array(Type.String())),
            fee: Type.Optional(Amount),
            nonce: Type.Optional(Amount),
            network: Network,
        }),
        handler: zestRepay,
        signed: true,
        optional: true,
    },
];
