declare const _default: import("eve/tools").ToolDefinition<{
    tokenFrom: string;
    tokenTo: string;
    amount: string | number;
    minAmountOut: string | number;
    senderKey?: string | undefined;
    fee?: string | number | undefined;
    nonce?: string | number | undefined;
    network?: "mainnet" | "testnet" | undefined;
    functionArgsHex?: string[] | undefined;
    functionName?: string | undefined;
}, import("@stacks/agent-core").BroadcastResult>;
export default _default;
