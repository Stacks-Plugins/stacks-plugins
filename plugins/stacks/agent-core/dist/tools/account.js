"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = getBalance;
exports.sendTokens = sendTokens;
exports.getAccountHistory = getAccountHistory;
const transactions_1 = require("@stacks/transactions");
const client_1 = require("../client");
/** Fetch the STX, fungible, and non-fungible token balances for an account. */
async function getBalance(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const url = `${(0, client_1.apiUrl)(network)}/extended/v1/address/${params.address}/balances`;
    const res = await (0, client_1.fetchFn)(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch balance for ${params.address}: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const fungibleTokens = {};
    for (const [key, value] of Object.entries(json.fungible_tokens ?? {})) {
        fungibleTokens[key] = { balance: String(value.balance) };
    }
    const nonFungibleTokens = {};
    for (const [key, value] of Object.entries(json.non_fungible_tokens ?? {})) {
        nonFungibleTokens[key] = { count: String(value.count) };
    }
    return {
        address: params.address,
        network,
        stx: String(json.stx?.balance ?? '0'),
        locked: String(json.stx?.locked ?? '0'),
        totalSent: String(json.stx?.total_sent ?? '0'),
        totalReceived: String(json.stx?.total_received ?? '0'),
        fungibleTokens,
        nonFungibleTokens,
    };
}
/** Build, sign, and broadcast an STX transfer. Returns the resulting txid. */
async function sendTokens(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const txOptions = {
        recipient: params.recipient,
        amount: BigInt(params.amount),
        senderKey: params.senderKey,
        network,
        memo: params.memo,
    };
    if (params.fee != null)
        txOptions.fee = BigInt(params.fee);
    if (params.nonce != null)
        txOptions.nonce = BigInt(params.nonce);
    const transaction = await (0, transactions_1.makeSTXTokenTransfer)(txOptions);
    const result = await (0, transactions_1.broadcastTransaction)({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
/** Fetch paginated transaction history for an account. */
async function getAccountHistory(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const limit = Math.min(params.limit ?? 20, 50);
    const offset = params.offset ?? 0;
    const url = `${(0, client_1.apiUrl)(network)}/extended/v2/addresses/${params.address}/transactions` +
        `?limit=${limit}&offset=${offset}`;
    const res = await (0, client_1.fetchFn)(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch history for ${params.address}: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return {
        address: params.address,
        network,
        total: json.total ?? 0,
        limit,
        offset,
        transactions: json.results ?? [],
    };
}
