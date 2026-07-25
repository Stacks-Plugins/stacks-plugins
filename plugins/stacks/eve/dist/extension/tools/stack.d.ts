declare const _default: import("eve/tools").ToolDefinition<{
    amount: string | number;
    cycles: number;
    poxAddress: string;
    senderKey?: string | undefined;
    fee?: string | number | undefined;
    nonce?: string | number | undefined;
    network?: "mainnet" | "testnet" | undefined;
    burnBlockHeight?: number | undefined;
}, import("@sugarhi11/agent-core").BroadcastResult>;
export default _default;
