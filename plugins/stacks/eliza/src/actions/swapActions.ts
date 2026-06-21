import {
  bridgeInitiate,
  bridgeQuote,
  swapExecute,
  swapQuote,
} from '@stacks/agent-core';
import type { Action } from '@elizaos/core';
import { makeAction } from '../shared';

export const swapActions: Action[] = [
  makeAction({
    name: 'stacks_swap_quote',
    description:
      'Get a token swap quote from the ALEX DEX (mainnet). ' +
      'Params: { tokenFrom, tokenTo, amount }.',
    similes: ['SWAP_QUOTE', 'ALEX_QUOTE', 'PRICE_QUOTE'],
    handler: swapQuote,
  }),
  makeAction({
    name: 'stacks_swap_execute',
    description:
      'Execute a token swap on the ALEX DEX. ' +
      'Params: { tokenFrom, tokenTo, amount, minAmountOut, senderKey, functionArgsHex? }.',
    similes: ['SWAP_TOKENS', 'EXECUTE_SWAP', 'ALEX_SWAP'],
    handler: swapExecute,
  }),
  makeAction({
    name: 'stacks_bridge_quote',
    description:
      'Get a cross-chain bridge quote via Allbridge Core. ' +
      'Params: { fromChain, toChain, token, amount }.',
    similes: ['BRIDGE_QUOTE', 'CROSS_CHAIN_QUOTE'],
    handler: bridgeQuote,
  }),
  makeAction({
    name: 'stacks_bridge_initiate',
    description:
      'Initiate a cross-chain bridge transfer (guided). ' +
      'Params: { fromChain, toChain, token, amount, recipient, senderKey }.',
    similes: ['BRIDGE_TOKENS', 'INITIATE_BRIDGE'],
    handler: bridgeInitiate,
  }),
];
