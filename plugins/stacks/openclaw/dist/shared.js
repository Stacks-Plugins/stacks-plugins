import { formatAccountHistory } from './formatters.js';
import { normalizeSendParams, requireSendParams } from './params.js';
import { formatMicroStx, getStacksSenderKey, getStacksWalletConfig, parseStxAmount, resolveStacksAddress, } from './wallet.js';
function needsAddressResolution(name) {
    return (name.includes('balance') ||
        name.includes('history') ||
        name.includes('stacking_status') ||
        name === 'stacks_lookup_address' ||
        name === 'stacks_can_stack');
}
function requiresAddress(name) {
    return name.includes('balance') || name.includes('history');
}
export function enrichParams(spec, params, ctx) {
    const wallet = getStacksWalletConfig(ctx.pluginConfig);
    let enriched = spec.name === 'stacks_send_tokens' ? normalizeSendParams(params) : { ...params };
    if (!enriched.network) {
        enriched.network = wallet.network;
    }
    if ('address' in enriched || needsAddressResolution(spec.name)) {
        const resolved = resolveStacksAddress(enriched.address, ctx.pluginConfig);
        if (resolved) {
            enriched.address = resolved;
        }
        else if (requiresAddress(spec.name)) {
            throw new Error('No wallet address configured. Set STACKS_SENDER_KEY or STACKS_WALLET_ADDRESS in .env.');
        }
    }
    if (spec.signed) {
        const senderKey = getStacksSenderKey();
        if (!enriched.senderKey && senderKey) {
            enriched.senderKey = senderKey;
        }
        if (!enriched.senderKey) {
            throw new Error('No signing key configured. Set STACKS_SENDER_KEY in .env for sends and other write actions.');
        }
    }
    if (spec.parseAmount && enriched.amount != null) {
        const micro = parseStxAmount(enriched.amount);
        if (!micro) {
            throw new Error(`Could not parse STX amount: ${enriched.amount}`);
        }
        enriched.amount = micro;
    }
    if (spec.name === 'stacks_send_tokens') {
        requireSendParams(enriched);
        if (!spec.parseAmount && enriched.amount != null) {
            const micro = parseStxAmount(enriched.amount);
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
            `Spendable: ${formatMicroStx(b.stx ?? '0')}`,
            `Locked (stacking): ${formatMicroStx(b.locked ?? '0')}`,
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
            const net = getStacksWalletConfig().network;
            const id = r.txid.startsWith('0x') ? r.txid.slice(2) : r.txid;
            const explorer = net === 'mainnet'
                ? `https://explorer.hiro.so/txid/${id}`
                : `https://explorer.hiro.so/txid/${id}?chain=testnet`;
            return `Transfer submitted successfully.\nTxID: ${r.txid}\nExplorer: ${explorer}`;
        }
        return `Transfer failed: ${r.error ?? 'unknown'}${r.reason ? ` (${r.reason})` : ''}`;
    }
    if (spec.name === 'stacks_get_account_history' && result && typeof result === 'object') {
        return formatAccountHistory(result);
    }
    return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
}
export function executeTool(spec, rawParams, ctx) {
    return (async () => {
        try {
            const params = enrichParams(spec, rawParams, ctx);
            const result = await spec.handler(params);
            const text = spec.formatResult
                ? spec.formatResult(result, params)
                : defaultFormatResult(spec, result);
            return { text, isError: false };
        }
        catch (error) {
            return {
                text: `Stacks tool ${spec.name} failed: ${error?.message ?? String(error)}`,
                isError: true,
            };
        }
    })();
}
