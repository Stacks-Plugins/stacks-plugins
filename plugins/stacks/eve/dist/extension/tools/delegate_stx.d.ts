declare const _default: import("eve/tools").ToolDefinition<{
    amount: string | number;
    delegateTo: string;
    senderKey?: string | undefined;
    fee?: string | number | undefined;
    nonce?: string | number | undefined;
    network?: "mainnet" | "testnet" | undefined;
    untilBurnBlockHeight?: number | undefined;
    poxAddress?: string | undefined;
}, import("@sugarhi11/agent-core").BroadcastResult>;
export default _default;
