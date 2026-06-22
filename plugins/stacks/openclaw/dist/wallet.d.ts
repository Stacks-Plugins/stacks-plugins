export interface StacksWalletConfig {
    network: 'mainnet' | 'testnet';
    address?: string;
    hasSenderKey: boolean;
}
export declare function getStacksSenderKey(): string | undefined;
export declare function getStacksWalletConfig(pluginConfig?: {
    defaultNetwork?: string;
}): StacksWalletConfig;
export declare function resolveStacksAddress(address?: string, pluginConfig?: {
    defaultNetwork?: string;
}): string | undefined;
/** Convert human STX amounts (e.g. "1", "0.5 STX") to microSTX strings. */
export declare function parseStxAmount(amount: string | number | undefined): string | undefined;
export declare function formatMicroStx(microStx: string | number): string;
export declare function walletContextText(pluginConfig?: {
    defaultNetwork?: string;
}): string;
