"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractCall = contractCall;
exports.readOnlyCall = readOnlyCall;
exports.decodeCv = decodeCv;
const transactions_1 = require("@stacks/transactions");
const client_1 = require("../client");
function decodeArgs(functionArgsHex) {
    return (functionArgsHex ?? []).map(hex => (0, transactions_1.deserializeCV)(hex));
}
/** Build, sign, and broadcast a public Clarity contract function call. */
async function contractCall(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const txOptions = {
        contractAddress: params.contractAddress,
        contractName: params.contractName,
        functionName: params.functionName,
        functionArgs: decodeArgs(params.functionArgsHex),
        senderKey: params.senderKey,
        network,
    };
    if (params.fee != null)
        txOptions.fee = BigInt(params.fee);
    if (params.nonce != null)
        txOptions.nonce = BigInt(params.nonce);
    const transaction = await (0, transactions_1.makeContractCall)(txOptions);
    const result = await (0, transactions_1.broadcastTransaction)({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
/** Evaluate a read-only Clarity contract function and return its decoded result. */
async function readOnlyCall(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const senderAddress = params.senderAddress ?? params.contractAddress;
    const result = await (0, transactions_1.fetchCallReadOnlyFunction)({
        contractAddress: params.contractAddress,
        contractName: params.contractName,
        functionName: params.functionName,
        functionArgs: decodeArgs(params.functionArgsHex),
        senderAddress,
        network,
        client: (0, client_1.stacksClient)(network),
    });
    return { value: (0, transactions_1.cvToJSON)(result), hex: (0, transactions_1.serializeCV)(result) };
}
/** Decode a hex-encoded serialized Clarity value into readable JSON. */
function decodeCv(params) {
    const cv = (0, transactions_1.deserializeCV)(params.hex);
    return { value: (0, transactions_1.cvToJSON)(cv), hex: params.hex };
}
