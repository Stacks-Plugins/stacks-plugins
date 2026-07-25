import {
  zestBorrow,
  zestCollateralAddSbtc,
  zestPosition,
  zestProtocolStatus,
  zestRedeemSbtc,
  zestRepay,
  zestSbtcVaultInfo,
  zestSupplySbtc,
} from '@sugarhi11/agent-core';
import type { Action } from '@elizaos/core';
import { makeAction } from '../shared';

export const zestActions: Action[] = [
  makeAction({
    name: 'stacks_zest_sbtc_vault_info',
    description:
      'Read Zest vault-sbtc utilization, borrow APR, and available liquidity. ' +
      'Use before supply/redeem to preview yield. Params: { network? }.',
    similes: ['ZEST_VAULT_INFO', 'ZEST_APY', 'ZEST_YIELD'],
    handler: zestSbtcVaultInfo,
  }),
  makeAction({
    name: 'stacks_zest_protocol_status',
    description:
      'Read Zest pause flags on the sBTC vault. Always call before Zest writes when protocol may be paused. ' +
      'Params: { network? }.',
    similes: ['ZEST_STATUS', 'ZEST_PAUSED', 'ZEST_PROTOCOL_STATUS'],
    handler: zestProtocolStatus,
  }),
  makeAction({
    name: 'stacks_zest_supply_sbtc',
    description:
      'Supply sBTC to Zest vault-sbtc to earn yield (receive zsBTC shares). ' +
      'Check pause state first. Params: { amount, minOut?, recipient?, network? }. senderKey auto-injected.',
    similes: ['ZEST_SUPPLY', 'SUPPLY_SBTC_ZEST', 'LEND_SBTC'],
    handler: zestSupplySbtc,
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
  makeAction({
    name: 'stacks_zest_redeem_sbtc',
    description:
      'Redeem zsBTC shares from Zest vault-sbtc back to sBTC. ' +
      'Params: { shares, minUnderlying?, recipient?, network? }. senderKey auto-injected.',
    similes: ['ZEST_REDEEM', 'WITHDRAW_ZEST', 'UNSTAKE_SBTC_ZEST'],
    handler: zestRedeemSbtc,
    signed: true,
  }),
  makeAction({
    name: 'stacks_zest_position',
    description:
      'Read a Zest market position (collateral and debt) for a Stacks address. ' +
      'Params: { address?: string, network? }.',
    similes: ['ZEST_POSITION', 'MY_ZEST_LOAN', 'ZEST_COLLATERAL'],
    handler: zestPosition,
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
  makeAction({
    name: 'stacks_zest_collateral_add_sbtc',
    description:
      'Post sBTC as collateral on Zest market for borrowing. Check pause state first. ' +
      'Params: { amount, assetContract?, priceFeedsHex?, network? }. senderKey auto-injected.',
    similes: ['ZEST_COLLATERAL', 'ADD_SBTC_COLLATERAL'],
    handler: zestCollateralAddSbtc,
    signed: true,
  }),
  makeAction({
    name: 'stacks_zest_borrow',
    description:
      'Borrow an asset from Zest market against posted collateral. Check pause state and position first. ' +
      'Params: { assetContract, amount, receiver?, priceFeedsHex?, network? }. senderKey auto-injected.',
    similes: ['ZEST_BORROW', 'BORROW_ON_ZEST'],
    handler: zestBorrow,
    signed: true,
  }),
  makeAction({
    name: 'stacks_zest_repay',
    description:
      'Repay borrowed debt on Zest market. ' +
      'Params: { assetContract, amount, priceFeedsHex?, network? }. senderKey auto-injected.',
    similes: ['ZEST_REPAY', 'REPAY_ZEST_LOAN'],
    handler: zestRepay,
    signed: true,
  }),
];
