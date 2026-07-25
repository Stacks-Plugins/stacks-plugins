declare const _default: import("eve/tools").ToolDefinition<{
    contractAddress: string;
    contractName: string;
    functionName: string;
    senderKey?: string | undefined;
    fee?: string | number | undefined;
    nonce?: string | number | undefined;
    network?: "mainnet" | "testnet" | undefined;
    functionArgsHex?: string[] | undefined;
}, import("@sugarhi11/agent-core").BroadcastResult>;
export default _default;
