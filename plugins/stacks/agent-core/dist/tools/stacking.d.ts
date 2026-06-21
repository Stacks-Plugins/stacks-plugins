import { BroadcastResult, CanStackParams, DelegateStxParams, RevokeDelegateParams, StackingStatusParams, StackParams } from '../types';
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
export declare function canStack(params: CanStackParams): Promise<{
    address: string;
    network: "mainnet" | "testnet" | "devnet" | "mocknet";
    eligible: boolean;
    reason: any;
}>;
export declare function stack(params: StackParams): Promise<BroadcastResult>;
export declare function delegateStx(params: DelegateStxParams): Promise<BroadcastResult>;
export declare function revokeDelegate(params: RevokeDelegateParams): Promise<BroadcastResult>;
