"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStacksWalletConfig = getStacksWalletConfig;
exports.resolveStacksAddress = resolveStacksAddress;
exports.parseStxAmount = parseStxAmount;
exports.formatMicroStx = formatMicroStx;
const transactions_1 = require("@stacks/transactions");
const MY_ADDRESS_ALIASES = new Set([
    'my',
    'me',
    'mine',
    'my wallet',
    'my address',
    'my account',
    'configured wallet',
    'agent wallet',
]);
function getStacksWalletConfig() {
    const network = (process.env.STACKS_NETWORK?.trim() || 'testnet');
    const senderKey = process.env.STACKS_SENDER_KEY?.trim();
    let address = process.env.STACKS_WALLET_ADDRESS?.trim();
    if (senderKey) {
        try {
            address = (0, transactions_1.privateKeyToAddress)(senderKey, network);
        }
        catch {
            if (!address) {
                address = undefined;
            }
        }
    }
    return { network, address, hasSenderKey: Boolean(senderKey) };
}
function resolveStacksAddress(address) {
    if (!address?.trim())
        return getStacksWalletConfig().address;
    const normalized = address.trim().toLowerCase();
    if (MY_ADDRESS_ALIASES.has(normalized)) {
        return getStacksWalletConfig().address;
    }
    return address.trim();
}
/** Convert human STX amounts (e.g. "1", "0.5 STX") to microSTX strings. */
function parseStxAmount(amount) {
    if (amount == null || amount === '')
        return undefined;
    if (typeof amount === 'number') {
        if (!Number.isFinite(amount))
            return undefined;
        if (Number.isInteger(amount) && amount >= 1000000) {
            return String(amount);
        }
        return String(Math.round(amount * 1000000));
    }
    const raw = amount.trim().toLowerCase().replace(/,/g, '').replace(/\s*stx\s*/g, '');
    if (!raw)
        return undefined;
    if (/^\d+$/.test(raw) && raw.length >= 7) {
        return raw;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed))
        return undefined;
    if (Number.isInteger(parsed) && parsed >= 1000000) {
        return String(parsed);
    }
    return String(Math.round(parsed * 1000000));
}
function formatMicroStx(microStx) {
    const micro = typeof microStx === 'string' ? Number(microStx) : microStx;
    if (!Number.isFinite(micro))
        return String(microStx);
    const stx = micro / 1000000;
    return `${stx.toLocaleString(undefined, { maximumFractionDigits: 6 })} STX (${micro} microSTX)`;
}
