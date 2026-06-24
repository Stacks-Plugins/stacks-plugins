import { StackingClient } from '@stacks/stacking';
import { stacksClient, resolveNetwork } from '../client';
function clientFor(address, network) {
    return new StackingClient({ address, network, client: stacksClient(network) });
}
function toBroadcastResult(result) {
    if (result && 'error' in result) {
        return { txid: result.txid ?? '', success: false, error: result.error, reason: result.reason };
    }
    return { txid: result.txid, success: true };
}
/** Get the current stacking (PoX lock) status for an account, including delegation info. */
export async function getStackingStatus(params) {
    const network = resolveNetwork(params.network);
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
/** Check whether an account is eligible to stack a given amount for a number of cycles. */
export async function canStack(params) {
    const network = resolveNetwork(params.network);
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
/** Lock STX for stacking (solo). Builds, signs, and broadcasts the `stack-stx` call. */
export async function stack(params) {
    const network = resolveNetwork(params.network);
    // Derive the stacker address from the private key via a throwaway client is not
    // straightforward here; the caller supplies the signing key and the client only
    // needs a network. StackingClient signs using the provided privateKey.
    const client = new StackingClient({
        address: params.poxAddress, // address field is informational for signing flows
        network,
        client: stacksClient(network),
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
/** Delegate STX to a stacking pool/operator (`delegate-stx`). */
export async function delegateStx(params) {
    const network = resolveNetwork(params.network);
    const client = new StackingClient({
        address: params.delegateTo,
        network,
        client: stacksClient(network),
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
/** Revoke an active stacking delegation (`revoke-delegate-stx`). */
export async function revokeDelegate(params) {
    const network = resolveNetwork(params.network);
    const client = new StackingClient({
        address: '',
        network,
        client: stacksClient(network),
    });
    const result = await client.revokeDelegateStx({
        privateKey: params.senderKey,
        fee: params.fee != null ? BigInt(params.fee) : undefined,
        nonce: params.nonce != null ? BigInt(params.nonce) : undefined,
    });
    return toBroadcastResult(result);
}
