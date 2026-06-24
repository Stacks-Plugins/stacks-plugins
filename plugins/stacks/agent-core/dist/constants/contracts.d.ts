import { NetworkArg } from '../types';
export declare const MAINNET_CONTRACTS: {
    readonly sbtcToken: {
        readonly address: "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";
        readonly name: "sbtc-token";
    };
    readonly sbtcWithdrawal: {
        readonly address: "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";
        readonly name: "sbtc-withdrawal";
    };
    readonly sbtcRegistry: {
        readonly address: "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";
        readonly name: "sbtc-registry";
    };
    readonly zestMarket: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-4-market";
    };
    readonly zestMarketVault: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-market-vault";
    };
    readonly zestVaultSbtc: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-vault-sbtc";
    };
    readonly zestAssets: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-assets";
    };
};
export declare const TESTNET_CONTRACTS: {
    readonly sbtcToken: {
        readonly address: "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT";
        readonly name: "sbtc-token";
    };
    readonly sbtcWithdrawal: {
        readonly address: "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT";
        readonly name: "sbtc-withdrawal";
    };
    readonly sbtcRegistry: {
        readonly address: "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT";
        readonly name: "sbtc-registry";
    };
    readonly zestMarket: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-4-market";
    };
    readonly zestMarketVault: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-market-vault";
    };
    readonly zestVaultSbtc: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-vault-sbtc";
    };
    readonly zestAssets: {
        readonly address: "SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7";
        readonly name: "v0-assets";
    };
};
export type NetworkContracts = typeof MAINNET_CONTRACTS | typeof TESTNET_CONTRACTS;
export declare function getNetworkContracts(network?: NetworkArg): NetworkContracts;
export declare function contractId(c: {
    address: string;
    name: string;
}): string;
