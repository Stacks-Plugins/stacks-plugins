"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapActions = void 0;
const agent_core_1 = require("@sugarhi11/agent-core");
const shared_1 = require("../shared");
exports.swapActions = [
    (0, shared_1.makeAction)({
        name: 'stacks_swap_quote',
        description: 'Get a token swap quote from the ALEX DEX (mainnet). ' +
            'Params: { tokenFrom, tokenTo, amount }.',
        similes: ['SWAP_QUOTE', 'ALEX_QUOTE', 'PRICE_QUOTE'],
        handler: agent_core_1.swapQuote,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_swap_execute',
        description: 'Execute a token swap on the ALEX DEX. ' +
            'Params: { tokenFrom, tokenTo, amount, minAmountOut, senderKey, functionArgsHex? }.',
        similes: ['SWAP_TOKENS', 'EXECUTE_SWAP', 'ALEX_SWAP'],
        handler: agent_core_1.swapExecute,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_bridge_quote',
        description: 'Get a cross-chain bridge quote via Allbridge Core. ' +
            'Params: { fromChain, toChain, token, amount }.',
        similes: ['BRIDGE_QUOTE', 'CROSS_CHAIN_QUOTE'],
        handler: agent_core_1.bridgeQuote,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_bridge_initiate',
        description: 'Initiate a cross-chain bridge transfer (guided). ' +
            'Params: { fromChain, toChain, token, amount, recipient, senderKey }.',
        similes: ['BRIDGE_TOKENS', 'INITIATE_BRIDGE'],
        handler: agent_core_1.bridgeInitiate,
    }),
];
