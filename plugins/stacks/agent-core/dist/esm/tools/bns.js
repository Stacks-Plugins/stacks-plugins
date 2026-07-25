import { buildTransferNameTx, getNamePrice as bnsGetNamePrice } from '@stacks/bns';
import { networkFrom } from '@stacks/network';
import { broadcastTransaction, privateKeyToPublic, publicKeyToHex, TransactionSigner, } from '@stacks/transactions';
import { apiUrl, fetchFn, resolveNetwork } from '../client';
/** Sign an unsigned BNS transaction with the sender key and broadcast it. */
async function signAndBroadcast(transaction, senderKey, network) {
    const signer = new TransactionSigner(transaction);
    signer.signOrigin(senderKey);
    const result = await broadcastTransaction({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
/** Resolve a BNS name to its owner address and zonefile. */
export async function resolveName(params) {
    const network = resolveNetwork(params.network);
    const url = `${apiUrl(network)}/v1/names/${encodeURIComponent(params.name)}`;
    const res = await fetchFn(url);
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
/** List all BNS names owned by a Stacks address. */
export async function lookupAddress(params) {
    const network = resolveNetwork(params.network);
    const url = `${apiUrl(network)}/v1/addresses/stacks/${params.address}`;
    const res = await fetchFn(url);
    if (!res.ok) {
        throw new Error(`Failed to look up ${params.address}: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return { address: params.address, network, names: json.names ?? [] };
}
/** Get the registration price (in microSTX) for a BNS name. */
export async function getNamePrice(params) {
    const network = resolveNetwork(params.network);
    const amount = await bnsGetNamePrice({
        fullyQualifiedName: params.name,
        network: networkFrom(network),
    });
    return { name: params.name, network, amount: amount.toString() };
}
/** Transfer ownership of a BNS name to another address (`name-transfer`). */
export async function transferName(params) {
    const network = resolveNetwork(params.network);
    const publicKey = publicKeyToHex(privateKeyToPublic(params.senderKey));
    const transaction = await buildTransferNameTx({
        fullyQualifiedName: params.name,
        newOwnerAddress: params.newOwnerAddress,
        zonefile: params.zonefile,
        publicKey,
        network: networkFrom(network),
    });
    return signAndBroadcast(transaction, params.senderKey, network);
}
