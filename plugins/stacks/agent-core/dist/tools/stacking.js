"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackingStatus = getStackingStatus;
exports.canStack = canStack;
exports.stack = stack;
exports.delegateStx = delegateStx;
exports.revokeDelegate = revokeDelegate;
const stacking_1 = require("@stacks/stacking");
const client_1 = require("../client");
function clientFor(address, network) {
    return new stacking_1.StackingClient({ address, network, client: (0, client_1.stacksClient)(network) });
}
function toBroadcastResult(result) {
    if (result && 'error' in result) {
        return { txid: result.txid ?? '', success: false, error: result.error, reason: result.reason };
    }
    return { txid: result.txid, success: true };
}
async function getStackingStatus(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const client = clientFor(params.address, network);
    const [poxInfo, stackerInfo, delegationInfo] = await Promise.all([
        client.getPoxInfo(),
        client.getStatus(),
        client.getDelegationStatus().catch(() => ({ delegated: false })),
    ]);
    return {
        address: params.address,
        network,
        currentCycle: poxInfo.current_cycle?.id,
        nextCycle: poxInfo.next_cycle?.id,
        minThresholdUstx: String(poxInfo.next_cycle?.min_threshold_ustx ?? '0'),
        stacking: stackerInfo,
        delegation: delegationInfo,
    };
}
async function canStack(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const client = clientFor(params.address, network);
    const result = await client.canStack({
        poxAddress: params.poxAddress,
        cycles: params.cycles,
    });
    return {
        address: params.address,
        network,
        eligible: result.eligible,
        reason: result.reason,
    };
}
async function stack(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const client = new stacking_1.StackingClient({
        address: params.poxAddress,
        network,
        client: (0, client_1.stacksClient)(network),
    });
    const burnBlockHeight = params.burnBlockHeight ?? (await client.getPoxInfo()).next_cycle.prepare_phase_start_block_height;
    const result = await client.stack({
        amountMicroStx: BigInt(params.amount),
        poxAddress: params.poxAddress,
        cycles: params.cycles,
        burnBlockHeight,
        privateKey: params.senderKey,
        fee: params.fee != null ? BigInt(params.fee) : undefined,
        nonce: params.nonce != null ? BigInt(params.nonce) : undefined,
    });
    return toBroadcastResult(result);
}
async function delegateStx(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const client = new stacking_1.StackingClient({
        address: params.delegateTo,
        network,
        client: (0, client_1.stacksClient)(network),
    });
    const result = await client.delegateStx({
        amountMicroStx: BigInt(params.amount),
        delegateTo: params.delegateTo,
        untilBurnBlockHeight: params.untilBurnBlockHeight,
        poxAddress: params.poxAddress,
        privateKey: params.senderKey,
        fee: params.fee != null ? BigInt(params.fee) : undefined,
        nonce: params.nonce != null ? BigInt(params.nonce) : undefined,
    });
    return toBroadcastResult(result);
}
async function revokeDelegate(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const client = new stacking_1.StackingClient({
        address: '',
        network,
        client: (0, client_1.stacksClient)(network),
    });
    const result = await client.revokeDelegateStx({
        privateKey: params.senderKey,
        fee: params.fee != null ? BigInt(params.fee) : undefined,
        nonce: params.nonce != null ? BigInt(params.nonce) : undefined,
    });
    return toBroadcastResult(result);
}
//# sourceMappingURL=stacking.js.map