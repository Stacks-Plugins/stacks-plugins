declare const _default: import("eve/tools").ToolDefinition<{
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgsHex?: string[] | undefined;
    senderAddress?: string | undefined;
    network?: "mainnet" | "testnet" | undefined;
}, import("@stacks/agent-core").ReadOnlyCallResult>;
export default _default;
