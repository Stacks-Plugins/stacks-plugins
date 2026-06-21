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
async function contractCall(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const txOptions = {
        contractAddress: params.contractAddress,
        contractName: params.contractName,
        functionName: params.functionName,
        functionArgs: decodeArgs(params.functionArgsHex),
        senderKey: params.senderKey,
        network,
        fee: params.fee != null ? BigInt(params.fee) : undefined,
        nonce: params.nonce != null ? BigInt(params.nonce) : undefined,
    };
    const transaction = await (0, transactions_1.makeContractCall)(txOptions);
    const result = await (0, transactions_1.broadcastTransaction)({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
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
function decodeCv(params) {
    const cv = (0, transactions_1.deserializeCV)(params.hex);
    return { value: (0, transactions_1.cvToJSON)(cv), hex: params.hex };
}
//# sourceMappingURL=contracts.js.map