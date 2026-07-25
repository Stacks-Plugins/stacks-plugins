import { BroadcastResult, CanStackParams, DelegateStxParams, RevokeDelegateParams, StackingStatusParams, StackParams } from '../types';
/** Get the current stacking (PoX lock) status for an account, including delegation info. */
export declare function getStackingStatus(params: StackingStatusParams): Promise<{
    address: string;
    network: "mainnet" | "testnet" | "devnet" | "mocknet";
    currentCycle: number;
    nextCycle: number;
    minThresholdUstx: string;
    stacking: import("@stacks/stacking").StackerInfo;
    delegation: import("@stacks/stacking").DelegationInfo | {
        delegated: boolean;
    };
}>;
/** Check whether an account is eligible to stack a given amount for a number of cycles. */
export declare function canStack(params: CanStackParams): Promise<{
    address: string;
    network: "mainnet" | "testnet" | "devnet" | "mocknet";
    eligible: boolean;
    reason: any;
}>;
/** Lock STX for stacking (solo). Builds, signs, and broadcasts the `stack-stx` call. */
export declare function stack(params: StackParams): Promise<BroadcastResult>;
/** Delegate STX to a stacking pool/operator (`delegate-stx`). */
export declare function delegateStx(params: DelegateStxParams): Promise<BroadcastResult>;
/** Revoke an active stacking delegation (`revoke-delegate-stx`). */
export declare function revokeDelegate(params: RevokeDelegateParams): Promise<BroadcastResult>;
