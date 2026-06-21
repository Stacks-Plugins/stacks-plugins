"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveName = resolveName;
exports.lookupAddress = lookupAddress;
exports.getNamePrice = getNamePrice;
exports.transferName = transferName;
const bns_1 = require("@stacks/bns");
const network_1 = require("@stacks/network");
const transactions_1 = require("@stacks/transactions");
const client_1 = require("../client");
async function signAndBroadcast(transaction, senderKey, network) {
    const signer = new transactions_1.TransactionSigner(transaction);
    signer.signOrigin(senderKey);
    const result = await (0, transactions_1.broadcastTransaction)({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
async function resolveName(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const url = `${(0, client_1.apiUrl)(network)}/v1/names/${encodeURIComponent(params.name)}`;
    const res = await (0, client_1.fetchFn)(url);
    if (res.status === 404) {
        return { name: params.name, network, found: false };
    }
    if (!res.ok) {
        throw new Error(`Failed to resolve ${params.name}: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return {
        name: params.name,
        network,
        address: json.address,
        zonefile: json.zonefile,
        expireBlock: json.expire_block,
        status: json.status,
        found: true,
    };
}
async function lookupAddress(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const url = `${(0, client_1.apiUrl)(network)}/v1/addresses/stacks/${params.address}`;
    const res = await (0, client_1.fetchFn)(url);
    if (!res.ok) {
        throw new Error(`Failed to look up ${params.address}: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return { address: params.address, network, names: json.names ?? [] };
}
async function getNamePrice(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const amount = await (0, bns_1.getNamePrice)({
        fullyQualifiedName: params.name,
        network: (0, network_1.networkFrom)(network),
    });
    return { name: params.name, network, amount: amount.toString() };
}
async function transferName(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const publicKey = (0, transactions_1.publicKeyToHex)((0, transactions_1.privateKeyToPublic)(params.senderKey));
    const transaction = await (0, bns_1.buildTransferNameTx)({
        fullyQualifiedName: params.name,
        newOwnerAddress: params.newOwnerAddress,
        zonefile: params.zonefile,
        publicKey,
        network: (0, network_1.networkFrom)(network),
    });
    return signAndBroadcast(transaction, params.senderKey, network);
}
//# sourceMappingURL=bns.js.map