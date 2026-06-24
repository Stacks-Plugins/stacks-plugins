import { formatAccountHistory } from './formatters.js';
import { BROADCAST_RESULT_TOOLS, formatBroadcastResult, formatSbtcBalanceResult, } from './broadcastFormat.js';
import { normalizeSendParams, requireSendParams } from './params.js';
import { formatMicroStx, getStacksSenderKey, getStacksWalletConfig, parseStxAmount, resolveStacksAddress, } from './wallet.js';
function needsAddressResolution(name) {
    return (name.includes('balance') ||
        name.includes('history') ||
        name.includes('stacking_status') ||
        name === 'stacks_lookup_address' ||
        name === 'stacks_can_stack' ||
        name === 'stacks_zest_position' ||
        name === 'stacks_sbtc_get_balance');
}
function needsStacksAddressResolution(name) {
    return (name.includes('sbtc_build_peg') ||
        name.includes('sbtc_initiate_peg_in') ||
        name.includes('sbtc_get_peg_status'));
}
function requiresAddress(name) {
    return (name.includes('balance') ||
        name.includes('history') ||
        name === 'stacks_sbtc_get_balance' ||
        name === 'stacks_zest_position');
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
    if ('stacksAddress' in enriched || needsStacksAddressResolution(spec.name)) {
        const resolved = resolveStacksAddress(enriched.stacksAddress, ctx.pluginConfig);
        if (resolved) {
            enriched.stacksAddress = resolved;
        }
        else if (spec.name.includes('sbtc_build_peg') || spec.name.includes('sbtc_initiate_peg_in')) {
            const fallback = resolveStacksAddress(undefined, ctx.pluginConfig);
            if (fallback) {
                enriched.stacksAddress = fallback;
            }
            else if (spec.name.includes('sbtc_build_peg')) {
                throw new Error('stacksAddress is required. Set STACKS_SENDER_KEY or pass stacksAddress explicitly.');
            }
        }
    }
    if (spec.name === 'stacks_sbtc_initiate_peg_in') {
        const senderKey = getStacksSenderKey();
        if (!enriched.senderKey && senderKey) {
            enriched.senderKey = senderKey;
        }
    }
    if (spec.name === 'stacks_send_sbtc') {
        const walletAddr = wallet.address;
        const recipient = resolveStacksAddress(enriched.recipient, ctx.pluginConfig);
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
        return formatBroadcastResult(result, getStacksWalletConfig().network, 'STX transfer');
    }
    if (spec.name === 'stacks_sbtc_get_balance' && result && typeof result === 'object') {
        return formatSbtcBalanceResult(result);
    }
    if (BROADCAST_RESULT_TOOLS.has(spec.name) && result && typeof result === 'object') {
        const label = spec.name === 'stacks_send_sbtc'
            ? 'sBTC transfer'
            : spec.name.startsWith('stacks_zest_')
                ? 'Zest transaction'
                : 'Transaction';
        return formatBroadcastResult(result, getStacksWalletConfig().network, label);
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
