import {
  sbtcBuildPegIn,
  sbtcGetBalance,
  sbtcGetPegStatus,
  sbtcInitiatePegIn,
  sbtcInitiatePegOut,
  sendSbtc,
} from '@sugarhi11/agent-core';
import type { Action } from '@elizaos/core';
import { makeAction } from '../shared';

export const sbtcActions: Action[] = [
  makeAction({
    name: 'stacks_sbtc_get_balance',
    description:
      'Get sBTC balance for a Stacks address. Use when the user asks about sBTC holdings. ' +
      'Amounts use 8 decimals (satoshis). Omit `address` for the agent wallet. ' +
      'Params: { address?: string, network?: "mainnet"|"testnet" }.',
    similes: [
      'SBTC_BALANCE',
      'GET_SBTC',
      'MY_SBTC',
      'CHECK_SBTC',
      'HOW_MUCH_SBTC',
    ],
    handler: sbtcGetBalance,
    examples: [
      [
        { name: 'user', content: { text: 'What is my sBTC balance?' } },
        {
          name: 'agent',
          content: { text: 'Checking your sBTC balance.', action: 'STACKS_SBTC_GET_BALANCE' },
        },
      ],
    ],
  }),
  makeAction({
    name: 'stacks_send_sbtc',
    description:
      'Transfer sBTC on Stacks (SIP-010). Recipient must differ from sender (no self-transfers). Confirm recipient and amount before sending. ' +
      'Amount accepts human sBTC/BTC strings (e.g. "0.001") or base units. ' +
      'Params: { recipient: string, amount: string|number, memo?: string, network? }. senderKey auto-injected.',
    similes: ['SEND_SBTC', 'TRANSFER_SBTC', 'PAY_SBTC'],
    handler: sendSbtc,
    signed: true,
    examples: [
      [
        { name: 'user', content: { text: 'Send 0.0001 sBTC to ST2CY5Z53HBZ64TG3H3P3F4KZ2CVKKFBB6V2VC5Y' } },
        {
          name: 'agent',
          content: { text: 'Confirming sBTC transfer details.', action: 'STACKS_SEND_SBTC' },
        },
      ],
    ],
  }),
  makeAction({
    name: 'stacks_sbtc_build_peg_in',
    description:
      'Build an sBTC peg-in deposit address (BTC to sBTC) without broadcasting Bitcoin. ' +
      'Returns deposit address, scripts, and signer metadata. ' +
      'Params: { stacksAddress?: string, maxSignerFee?: number, reclaimLockTime?: number, network? }.',
    similes: ['BUILD_PEG_IN', 'SBTC_DEPOSIT_ADDRESS', 'PEG_IN_ADDRESS'],
    handler: sbtcBuildPegIn,
    examples: [
      [
        { name: 'user', content: { text: 'Show me the sBTC peg-in deposit address for my wallet' } },
        {
          name: 'agent',
          content: { text: 'Building peg-in deposit info.', action: 'STACKS_SBTC_BUILD_PEG_IN' },
        },
      ],
    ],
  }),
  makeAction({
    name: 'stacks_sbtc_initiate_peg_in',
    description:
      'Peg BTC into sBTC: signs and broadcasts a Bitcoin deposit tx and notifies Emily. ' +
      'Requires BITCOIN_PRIVATE_KEY and BITCOIN_ADDRESS in server env. ' +
      'Confirm amount before executing. Params: { amount: string|number, stacksAddress?, feeRate?, network? }.',
    similes: ['PEG_IN_BTC', 'DEPOSIT_BTC_SBTC', 'INITIATE_PEG_IN'],
    handler: sbtcInitiatePegIn,
    examples: [
      [
        { name: 'user', content: { text: 'Peg in 0.0001 BTC to sBTC on my Stacks wallet' } },
        {
          name: 'agent',
          content: { text: 'Confirm peg-in amount before broadcasting Bitcoin.', action: 'STACKS_SBTC_INITIATE_PEG_IN' },
        },
      ],
    ],
  }),
  makeAction({
    name: 'stacks_sbtc_initiate_peg_out',
    description:
      'Initiate sBTC peg-out (withdraw sBTC for BTC on Bitcoin L1). Async; poll status afterward. ' +
      'Params: { amount, bitcoinRecipient, maxFee?, network? }. senderKey auto-injected.',
    similes: ['PEG_OUT_SBTC', 'WITHDRAW_SBTC', 'SBTC_TO_BTC'],
    handler: sbtcInitiatePegOut,
    signed: true,
    examples: [
      [
        { name: 'user', content: { text: 'Peg out 0.0001 sBTC to my Bitcoin address bc1q...' } },
        {
          name: 'agent',
          content: { text: 'Confirm peg-out before submitting.', action: 'STACKS_SBTC_INITIATE_PEG_OUT' },
        },
      ],
    ],
  }),
  makeAction({
    name: 'stacks_sbtc_get_peg_status',
    description:
      'Query Emily for peg-in deposit status (bitcoinTxid) or peg-out withdrawals (stacksAddress). ' +
      'Params: { bitcoinTxid?, vout?, stacksAddress?, network? }.',
    similes: ['PEG_STATUS', 'SBTC_PEG_STATUS', 'WITHDRAWAL_STATUS'],
    handler: sbtcGetPegStatus,
    examples: [
      [
        { name: 'user', content: { text: 'Check status of my sBTC peg-out' } },
        {
          name: 'agent',
          content: { text: 'Querying peg status.', action: 'STACKS_SBTC_GET_PEG_STATUS' },
        },
      ],
    ],
  }),
];
