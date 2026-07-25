"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zestActions = void 0;
const agent_core_1 = require("@sugarhi11/agent-core");
const shared_1 = require("../shared");
exports.zestActions = [
    (0, shared_1.makeAction)({
        name: 'stacks_zest_sbtc_vault_info',
        description: 'Read Zest vault-sbtc utilization, borrow APR, and available liquidity. ' +
            'Use before supply/redeem to preview yield. Params: { network? }.',
        similes: ['ZEST_VAULT_INFO', 'ZEST_APY', 'ZEST_YIELD'],
        handler: agent_core_1.zestSbtcVaultInfo,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_zest_protocol_status',
        description: 'Read Zest pause flags on the sBTC vault. Always call before Zest writes when protocol may be paused. ' +
            'Params: { network? }.',
        similes: ['ZEST_STATUS', 'ZEST_PAUSED', 'ZEST_PROTOCOL_STATUS'],
        handler: agent_core_1.zestProtocolStatus,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_zest_supply_sbtc',
        description: 'Supply sBTC to Zest vault-sbtc to earn yield (receive zsBTC shares). ' +
            'Check pause state first. Params: { amount, minOut?, recipient?, network? }. senderKey auto-injected.',
        similes: ['ZEST_SUPPLY', 'SUPPLY_SBTC_ZEST', 'LEND_SBTC'],
        handler: agent_core_1.zestSupplySbtc,
        signed: true,
        examples: [
            [
                { name: 'user', content: { text: 'Supply 0.001 sBTC to Zest for yield' } },
                {
                    name: 'agent',
                    content: { text: 'Checking Zest pause state, then confirming supply.', action: 'STACKS_ZEST_SUPPLY_SBTC' },
                },
            ],
        ],
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_zest_redeem_sbtc',
        description: 'Redeem zsBTC shares from Zest vault-sbtc back to sBTC. ' +
            'Params: { shares, minUnderlying?, recipient?, network? }. senderKey auto-injected.',
        similes: ['ZEST_REDEEM', 'WITHDRAW_ZEST', 'UNSTAKE_SBTC_ZEST'],
        handler: agent_core_1.zestRedeemSbtc,
        signed: true,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_zest_position',
        description: 'Read a Zest market position (collateral and debt) for a Stacks address. ' +
            'Params: { address?: string, network? }.',
        similes: ['ZEST_POSITION', 'MY_ZEST_LOAN', 'ZEST_COLLATERAL'],
        handler: agent_core_1.zestPosition,
        examples: [
            [
                { name: 'user', content: { text: 'Show my Zest borrowing position' } },
                {
                    name: 'agent',
                    content: { text: 'Fetching your Zest position.', action: 'STACKS_ZEST_POSITION' },
                },
            ],
        ],
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_zest_collateral_add_sbtc',
        description: 'Post sBTC as collateral on Zest market for borrowing. Check pause state first. ' +
            'Params: { amount, assetContract?, priceFeedsHex?, network? }. senderKey auto-injected.',
        similes: ['ZEST_COLLATERAL', 'ADD_SBTC_COLLATERAL'],
        handler: agent_core_1.zestCollateralAddSbtc,
        signed: true,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_zest_borrow',
        description: 'Borrow an asset from Zest market against posted collateral. Check pause state and position first. ' +
            'Params: { assetContract, amount, receiver?, priceFeedsHex?, network? }. senderKey auto-injected.',
        similes: ['ZEST_BORROW', 'BORROW_ON_ZEST'],
        handler: agent_core_1.zestBorrow,
        signed: true,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_zest_repay',
        description: 'Repay borrowed debt on Zest market. ' +
            'Params: { assetContract, amount, priceFeedsHex?, network? }. senderKey auto-injected.',
        similes: ['ZEST_REPAY', 'REPAY_ZEST_LOAN'],
        handler: agent_core_1.zestRepay,
        signed: true,
    }),
];
