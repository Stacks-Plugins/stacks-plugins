declare const _default: import("eve/tools").ToolDefinition<{
    recipient: string;
    amount: string | number;
    senderKey?: string | undefined;
    fee?: string | number | undefined;
    nonce?: string | number | undefined;
    network?: "mainnet" | "testnet" | undefined;
    memo?: string | undefined;
}, import("@sugarhi11/agent-core").BroadcastResult>;
export default _default;
