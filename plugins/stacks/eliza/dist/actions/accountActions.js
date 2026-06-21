"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountActions = void 0;
const agent_core_1 = require("@stacks/agent-core");
const shared_1 = require("../shared");
exports.accountActions = [
    (0, shared_1.makeAction)({
        name: 'stacks_get_balance',
        description: 'Get STX, fungible, and non-fungible token balances for a Stacks address. ' +
            'Params: { address: string, network?: "mainnet"|"testnet" }.',
        similes: ['CHECK_STACKS_BALANCE', 'GET_STX_BALANCE', 'STX_BALANCE'],
        handler: agent_core_1.getBalance,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_send_tokens',
        description: 'Sign and broadcast an STX transfer. ' +
            'Params: { recipient: string, amount: string, senderKey: string, memo?: string, network? }.',
        similes: ['SEND_STX', 'TRANSFER_STX', 'SEND_STACKS'],
        handler: agent_core_1.sendTokens,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_get_account_history',
        description: 'Get paginated transaction history for a Stacks address. ' +
            'Params: { address: string, limit?: number, offset?: number, network? }.',
        similes: ['STACKS_HISTORY', 'GET_TRANSACTIONS', 'ACCOUNT_HISTORY'],
        handler: agent_core_1.getAccountHistory,
    }),
];
