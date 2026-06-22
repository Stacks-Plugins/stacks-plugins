type Network = 'mainnet' | 'testnet';
export declare function formatAccountHistory(result: {
    address?: string;
    network?: Network;
    total?: number;
    limit?: number;
    offset?: number;
    transactions?: unknown[];
}): string;
export {};
