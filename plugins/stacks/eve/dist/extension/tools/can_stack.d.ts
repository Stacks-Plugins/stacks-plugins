declare const _default: import("eve/tools").ToolDefinition<{
    address: string;
    amount: string | number;
    cycles: number;
    poxAddress: string;
    network?: "mainnet" | "testnet" | undefined;
}, {
    address: string;
    network: "mainnet" | "testnet" | "devnet" | "mocknet";
    eligible: boolean;
    reason: any;
}>;
export default _default;
