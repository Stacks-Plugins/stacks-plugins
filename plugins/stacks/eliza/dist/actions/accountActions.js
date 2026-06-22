"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountActions = void 0;
const agent_core_1 = require("@sugarhi11/agent-core");
const shared_1 = require("../shared");
exports.accountActions = [
    (0, shared_1.makeAction)({
        name: 'stacks_get_balance',
        description: 'Look up STX and token balances on Stacks. Use when the user asks about balance, ' +
            'how much STX they have, or wallet funds. Omit `address` to check the agent wallet. ' +
            'Params: { address?: string, network?: "mainnet"|"testnet" }.',
        similes: [
            'CHECK_STACKS_BALANCE',
            'GET_STX_BALANCE',
            'STX_BALANCE',
            'MY_BALANCE',
            'WALLET_BALANCE',
            'HOW_MUCH_STX',
            'CHECK_MY_WALLET',
            'SHOW_BALANCE',
        ],
        handler: agent_core_1.getBalance,
        examples: [
            [
                { name: 'user', content: { text: 'What is my STX balance?' } },
                { name: 'agent', content: { text: 'Checking your wallet balance now.', action: 'STACKS_GET_BALANCE' } },
            ],
            [
                { name: 'user', content: { text: 'How much STX do I have on testnet?' } },
                { name: 'agent', content: { text: 'Let me pull up your testnet balance.', action: 'STACKS_GET_BALANCE' } },
            ],
        ],
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_send_tokens',
        description: 'Send STX to another Stacks address. Use when the user wants to transfer, send, or pay STX. ' +
            'Confirm recipient and amount before sending. Amount can be in STX (e.g. "1" or "0.5") — converted automatically. ' +
            'Omit `senderKey` (injected from env). Params: { recipient: string, amount: string|number, memo?: string, network? }.',
        similes: [
            'SEND_STX',
            'TRANSFER_STX',
            'SEND_STACKS',
            'PAY_STX',
            'TRANSFER_FUNDS',
            'SEND_TO_ADDRESS',
        ],
        handler: agent_core_1.sendTokens,
        signed: true,
        parseAmount: true,
        examples: [
            [
                { name: 'user', content: { text: 'Send 0.001 STX to ST2CY5Z53HBZ64TG3H3P3F4KZ2CVKKFBB6V2VC5Y' } },
                {
                    name: 'agent',
                    content: {
                        text: 'I will send 0.001 STX to that address. Confirm to proceed.',
                        action: 'STACKS_SEND_TOKENS',
                    },
                },
            ],
        ],
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_get_account_history',
        description: 'Fetch recent transactions for a Stacks address. Use when the user asks for history, ' +
            'past transfers, or activity. Omit `address` for the agent wallet. ' +
            'Params: { address?: string, limit?: number, offset?: number, network? }.',
        similes: [
            'STACKS_HISTORY',
            'GET_TRANSACTIONS',
            'ACCOUNT_HISTORY',
            'MY_TRANSACTIONS',
            'TX_HISTORY',
            'RECENT_ACTIVITY',
            'PRINT_TRANSACTIONS',
            'LIST_TRANSACTIONS',
            'SHOW_TRANSACTIONS',
        ],
        handler: agent_core_1.getAccountHistory,
        examples: [
            [
                { name: 'user', content: { text: 'Show my recent transactions' } },
                {
                    name: 'agent',
                    content: { text: 'Pulling your recent on-chain activity.', action: 'STACKS_GET_ACCOUNT_HISTORY' },
                },
            ],
        ],
    }),
];
