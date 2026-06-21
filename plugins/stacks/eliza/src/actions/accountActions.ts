import { getAccountHistory, getBalance, sendTokens } from '@stacks/agent-core';
import type { Action } from '@elizaos/core';
import { makeAction } from '../shared';

export const accountActions: Action[] = [
  makeAction({
    name: 'stacks_get_balance',
    description:
      'Get STX, fungible, and non-fungible token balances for a Stacks address. ' +
      'Params: { address: string, network?: "mainnet"|"testnet" }.',
    similes: ['CHECK_STACKS_BALANCE', 'GET_STX_BALANCE', 'STX_BALANCE'],
    handler: getBalance,
  }),
  makeAction({
    name: 'stacks_send_tokens',
    description:
      'Sign and broadcast an STX transfer. ' +
      'Params: { recipient: string, amount: string, senderKey: string, memo?: string, network? }.',
    similes: ['SEND_STX', 'TRANSFER_STX', 'SEND_STACKS'],
    handler: sendTokens,
  }),
  makeAction({
    name: 'stacks_get_account_history',
    description:
      'Get paginated transaction history for a Stacks address. ' +
      'Params: { address: string, limit?: number, offset?: number, network? }.',
    similes: ['STACKS_HISTORY', 'GET_TRANSACTIONS', 'ACCOUNT_HISTORY'],
    handler: getAccountHistory,
  }),
];
