"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAction = makeAction;
const wallet_1 = require("./wallet");
const formatters_1 = require("./formatters");
const broadcastFormat_1 = require("./broadcastFormat");
const params_1 = require("./params");
function resolveParams(message, options, responses) {
    return (0, params_1.resolveParamsFromMessage)(message, options, responses);
}
function enrichParams(spec, params) {
    const wallet = (0, wallet_1.getStacksWalletConfig)();
    let enriched = spec.name === 'stacks_send_tokens' ? (0, params_1.normalizeSendParams)(params) : { ...params };
    if (!enriched.network) {
        enriched.network = wallet.network;
    }
    const needsAddress = 'address' in enriched ||
        spec.name.includes('balance') ||
        spec.name.includes('history') ||
        spec.name.includes('stacking_status') ||
        spec.name === 'stacks_zest_position';
    if (needsAddress) {
        const resolved = (0, wallet_1.resolveStacksAddress)(enriched.address);
        if (resolved) {
            enriched.address = resolved;
        }
        else if (spec.name.includes('balance') ||
            spec.name.includes('history') ||
            spec.name === 'stacks_sbtc_get_balance' ||
            spec.name === 'stacks_zest_position') {
            throw new Error('No wallet address configured. Set STACKS_SENDER_KEY or STACKS_WALLET_ADDRESS in .env.');
        }
    }
    if ('stacksAddress' in enriched ||
        spec.name.includes('sbtc_build_peg') ||
        spec.name.includes('sbtc_initiate_peg_in') ||
        spec.name.includes('sbtc_get_peg_status')) {
        const resolved = (0, wallet_1.resolveStacksAddress)(enriched.stacksAddress);
        if (resolved) {
            enriched.stacksAddress = resolved;
        }
        else if (spec.name.includes('sbtc_build_peg') ||
            spec.name.includes('sbtc_initiate_peg_in')) {
            const fallback = (0, wallet_1.resolveStacksAddress)(undefined);
            if (fallback) {
                enriched.stacksAddress = fallback;
            }
            else if (spec.name.includes('sbtc_build_peg')) {
                throw new Error('stacksAddress is required. Set STACKS_SENDER_KEY or pass stacksAddress explicitly.');
            }
        }
    }
    if (spec.name === 'stacks_sbtc_initiate_peg_in' && !enriched.senderKey && wallet.hasSenderKey) {
        enriched.senderKey = process.env.STACKS_SENDER_KEY;
    }
    if (spec.name === 'stacks_send_sbtc') {
        const walletAddr = wallet.address;
        const recipient = (0, wallet_1.resolveStacksAddress)(enriched.recipient);
        if (recipient) {
            enriched.recipient = recipient;
        }
        if (walletAddr && recipient === walletAddr) {
            throw new Error('Recipient cannot equal sender: sBTC self-transfers fail post-conditions (SentEq 0). Use a different Stacks address.');
        }
        if (!enriched.recipient) {
            throw new Error('recipient is required for stacks_send_sbtc.');
        }
    }
    if (spec.signed) {
        if (!enriched.senderKey && wallet.hasSenderKey) {
            enriched.senderKey = process.env.STACKS_SENDER_KEY;
        }
        if (!enriched.senderKey) {
            throw new Error('No signing key configured. Set STACKS_SENDER_KEY in .env for sends and other write actions.');
        }
    }
    if (spec.parseAmount && enriched.amount != null) {
        const micro = (0, wallet_1.parseStxAmount)(enriched.amount);
        if (!micro) {
            throw new Error(`Could not parse STX amount: ${enriched.amount}`);
        }
        enriched.amount = micro;
    }
    if (spec.name === 'stacks_send_tokens') {
        (0, params_1.requireSendParams)(enriched);
        if (!spec.parseAmount && enriched.amount != null) {
            const micro = (0, wallet_1.parseStxAmount)(enriched.amount);
            if (micro)
                enriched.amount = micro;
        }
    }
    return enriched;
}
function defaultFormatResult(spec, result) {
    if (spec.name === 'stacks_get_balance' && result && typeof result === 'object') {
        const b = result;
        const lines = [
            `Balance for ${b.address} (${b.network})`,
            `Spendable: ${(0, wallet_1.formatMicroStx)(b.stx ?? '0')}`,
            `Locked (stacking): ${(0, wallet_1.formatMicroStx)(b.locked ?? '0')}`,
        ];
        const tokens = Object.entries(b.fungibleTokens ?? {});
        if (tokens.length > 0) {
            lines.push('', 'Fungible tokens:');
            for (const [id, { balance }] of tokens.slice(0, 5)) {
                lines.push(`  ${id}: ${balance}`);
            }
        }
        return lines.join('\n');
    }
    if (spec.name === 'stacks_send_tokens' && result && typeof result === 'object') {
        return (0, broadcastFormat_1.formatBroadcastResult)(result, (0, wallet_1.getStacksWalletConfig)().network, 'STX transfer');
    }
    if (spec.name === 'stacks_sbtc_get_balance' && result && typeof result === 'object') {
        return (0, broadcastFormat_1.formatSbtcBalanceResult)(result);
    }
    if (broadcastFormat_1.BROADCAST_RESULT_TOOLS.has(spec.name) && result && typeof result === 'object') {
        const label = spec.name === 'stacks_send_sbtc'
            ? 'sBTC transfer'
            : spec.name.startsWith('stacks_zest_')
                ? 'Zest transaction'
                : 'Transaction';
        return (0, broadcastFormat_1.formatBroadcastResult)(result, (0, wallet_1.getStacksWalletConfig)().network, label);
    }
    if (spec.name === 'stacks_get_account_history' && result && typeof result === 'object') {
        return (0, formatters_1.formatAccountHistory)(result);
    }
    return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
}
function makeAction(spec) {
    return {
        name: spec.name.toUpperCase(),
        similes: spec.similes ?? [],
        description: spec.description,
        validate: async (_runtime, _message) => true,
        handler: async (_runtime, message, _state, options, callback, responses) => {
            try {
                const raw = resolveParams(message, options, responses);
                const params = enrichParams(spec, raw);
                const result = await spec.handler(params);
                const text = spec.formatResult
                    ? spec.formatResult(result, params)
                    : defaultFormatResult(spec, result);
                if (callback) {
                    await callback({ text, content: { success: true, result } });
                }
                return {
                    success: true,
                    text,
                    data: { actionName: spec.name, result },
                };
            }
            catch (error) {
                const text = `Stacks tool ${spec.name} failed: ${error?.message ?? String(error)}`;
                if (callback) {
                    await callback({ text, content: { success: false, error: text } });
                }
                return {
                    success: false,
                    text,
                    error: error instanceof Error ? error : new Error(String(error)),
                    data: { actionName: spec.name, error: text },
                };
            }
        },
        examples: spec.examples ?? [],
    };
}
