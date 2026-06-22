"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAction = makeAction;
const wallet_1 = require("./wallet");
const formatters_1 = require("./formatters");
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
    if ('address' in enriched || spec.name.includes('balance') || spec.name.includes('history') || spec.name.includes('stacking_status')) {
        const resolved = (0, wallet_1.resolveStacksAddress)(enriched.address);
        if (resolved) {
            enriched.address = resolved;
        }
        else if (spec.name.includes('balance') || spec.name.includes('history')) {
            throw new Error('No wallet address configured. Set STACKS_SENDER_KEY or STACKS_WALLET_ADDRESS in .env.');
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
        const r = result;
        if (r.success && r.txid) {
            const net = (0, wallet_1.getStacksWalletConfig)().network;
            const id = r.txid.startsWith('0x') ? r.txid.slice(2) : r.txid;
            const explorer = net === 'mainnet'
                ? `https://explorer.hiro.so/txid/${id}`
                : `https://explorer.hiro.so/txid/${id}?chain=testnet`;
            return `Transfer submitted successfully.\nTxID: ${r.txid}\nExplorer: ${explorer}`;
        }
        return `Transfer failed: ${r.error ?? 'unknown'}${r.reason ? ` (${r.reason})` : ''}`;
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
