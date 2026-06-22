"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stacksWalletProvider = void 0;
const core_1 = require("@elizaos/core");
const wallet_1 = require("../wallet");
exports.stacksWalletProvider = {
    name: 'STACKS_WALLET',
    description: 'Configured Stacks wallet, network, and available on-chain actions',
    position: 50,
    get: async (_runtime, _message, _state) => {
        const { network, address, hasSenderKey } = (0, wallet_1.getStacksWalletConfig)();
        const lines = [
            `Network: ${network}`,
            address ? `Agent wallet address: ${address}` : 'Agent wallet address: not configured',
            hasSenderKey
                ? 'Signing: ready (STACKS_SENDER_KEY is set server-side — never ask the user for a private key)'
                : 'Signing: not configured (read-only queries only until STACKS_SENDER_KEY is set)',
            '',
            'When the user says "my balance", "my wallet", or "send STX", use the agent wallet address above.',
            'For STACKS_GET_BALANCE you may omit `address` to use the agent wallet.',
            'For STACKS_SEND_TOKENS omit `senderKey` — it is injected automatically. Confirm sends before broadcasting.',
            'Amounts: users speak in STX (e.g. 1 STX = 1000000 microSTX). Convert before calling send.',
            'Use these actions for chat requests:',
            '- "balance" / "how much STX" → STACKS_GET_BALANCE',
            '- "history" / "transactions" / "print transactions" → STACKS_GET_ACCOUNT_HISTORY (relay exact TxIDs from output)',
            '- "send X STX to ADDRESS" → STACKS_SEND_TOKENS (confirm first)',
            '- BNS lookup → STACKS_RESOLVE_NAME',
        ];
        const text = (0, core_1.addHeader)('# Stacks Wallet', lines.join('\n'));
        return {
            text,
            values: {
                stacksNetwork: network,
                stacksWalletAddress: address,
                stacksCanSign: hasSenderKey,
            },
            data: { network, address, hasSenderKey },
        };
    },
};
