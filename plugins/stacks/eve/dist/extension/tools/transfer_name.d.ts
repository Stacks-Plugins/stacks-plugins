declare const _default: import("eve/tools").ToolDefinition<{
    name: string;
    newOwnerAddress: string;
    senderKey?: string | undefined;
    fee?: string | number | undefined;
    nonce?: string | number | undefined;
    network?: "mainnet" | "testnet" | undefined;
    zonefile?: string | undefined;
}, import("@stacks/agent-core").BroadcastResult>;
export default _default;
