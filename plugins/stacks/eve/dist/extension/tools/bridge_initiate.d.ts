declare const _default: import("eve/tools").ToolDefinition<{
    fromChain: string;
    toChain: string;
    token: string;
    amount: string | number;
    recipient: string;
    senderKey?: string | undefined;
    fee?: string | number | undefined;
    nonce?: string | number | undefined;
    network?: "mainnet" | "testnet" | undefined;
}, import("@sugarhi11/agent-core").BroadcastResult>;
export default _default;
