"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStacksAddress = extractStacksAddress;
exports.extractStxAmount = extractStxAmount;
exports.pickActionParams = pickActionParams;
exports.normalizeSendParams = normalizeSendParams;
exports.resolveParamsFromMessage = resolveParamsFromMessage;
exports.requireSendParams = requireSendParams;
const wallet_1 = require("./wallet");
/** Stacks c32 address charset (excludes I, L, O, U). */
const C32_CHARS = '123456789ABCDEFGHJKMNPQRSTVWXYZ';
const STACKS_ADDRESS_RE = new RegExp(`\\b(S[TP][${C32_CHARS}]{20,50})\\b`, 'gi');
const AMOUNT_WITH_UNIT_RE = /\b(\d+(?:\.\d+)?)\s*stx\b/i;
const SEND_AMOUNT_RE = /\b(?:send|transfer|pay)\s+(\d+(?:\.\d+)?)\b/i;
function extractStacksAddress(text) {
    if (!text)
        return undefined;
    const matches = [...text.matchAll(STACKS_ADDRESS_RE)].map((m) => m[1].toUpperCase());
    if (matches.length === 0)
        return undefined;
    // Prefer the last address in the message (usually the recipient after "to").
    return matches[matches.length - 1];
}
function extractStxAmount(text) {
    if (!text)
        return undefined;
    const withUnit = text.match(AMOUNT_WITH_UNIT_RE);
    if (withUnit)
        return withUnit[1];
    const sendPattern = text.match(SEND_AMOUNT_RE);
    if (sendPattern)
        return sendPattern[1];
    return undefined;
}
const IGNORE_OPTION_KEYS = new Set([
    'actionContext',
    'actionPlan',
    'onStreamChunk',
]);
function pickActionParams(options) {
    if (!options)
        return {};
    const params = {};
    for (const [key, value] of Object.entries(options)) {
        if (IGNORE_OPTION_KEYS.has(key))
            continue;
        if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
        }
    }
    return params;
}
function normalizeSendParams(params) {
    const out = { ...params };
    if (!out.recipient) {
        out.recipient =
            out.to ?? out.toAddress ?? out.recipientAddress ?? out.destination;
    }
    if (out.amount == null) {
        out.amount = out.stxAmount ?? out.stx ?? out.value ?? out.quantity;
    }
    if (typeof out.amount === 'object' && out.amount != null) {
        const nested = out.amount;
        out.amount = nested.amount ?? nested.value ?? nested.stx;
    }
    for (const key of ['fee', 'nonce']) {
        if (out[key] === '' || out[key] === null || out[key] === undefined) {
            delete out[key];
        }
    }
    delete out.to;
    delete out.toAddress;
    delete out.recipientAddress;
    delete out.destination;
    delete out.stxAmount;
    delete out.stx;
    delete out.value;
    delete out.quantity;
    return out;
}
function resolveParamsFromMessage(message, options, responses) {
    const params = pickActionParams(options);
    const content = message?.content ?? {};
    if (content.params && typeof content.params === 'object') {
        Object.assign(params, content.params);
    }
    const texts = [content.text ?? ''];
    for (const r of responses ?? []) {
        if (r.content?.text)
            texts.push(r.content.text);
    }
    for (const text of texts) {
        if (!params.recipient) {
            const address = extractStacksAddress(text);
            if (address)
                params.recipient = address;
        }
        if (params.amount == null) {
            const amount = extractStxAmount(text);
            if (amount != null)
                params.amount = amount;
        }
    }
    return params;
}
function requireSendParams(params) {
    if (!params.recipient || typeof params.recipient !== 'string') {
        throw new Error('Missing recipient address. Say e.g. "send 1 STX to ST2…" with a valid Stacks address.');
    }
    if (params.amount == null) {
        throw new Error('Missing amount. Say e.g. "send 1 STX to ST2…".');
    }
    const micro = (0, wallet_1.parseStxAmount)(params.amount);
    if (!micro) {
        throw new Error(`Could not parse STX amount: ${params.amount}`);
    }
}
