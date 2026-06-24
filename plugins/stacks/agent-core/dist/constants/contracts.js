"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESTNET_CONTRACTS = exports.MAINNET_CONTRACTS = void 0;
exports.getNetworkContracts = getNetworkContracts;
exports.contractId = contractId;
const ZEST_DEPLOYER = 'SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7';
exports.MAINNET_CONTRACTS = {
    sbtcToken: {
        address: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4',
        name: 'sbtc-token',
    },
    sbtcWithdrawal: {
        address: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4',
        name: 'sbtc-withdrawal',
    },
    sbtcRegistry: {
        address: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4',
        name: 'sbtc-registry',
    },
    zestMarket: {
        address: ZEST_DEPLOYER,
        name: 'v0-4-market',
    },
    zestMarketVault: {
        address: ZEST_DEPLOYER,
        name: 'v0-market-vault',
    },
    zestVaultSbtc: {
        address: ZEST_DEPLOYER,
        name: 'v0-vault-sbtc',
    },
    zestAssets: {
        address: ZEST_DEPLOYER,
        name: 'v0-assets',
    },
};
exports.TESTNET_CONTRACTS = {
    sbtcToken: {
        address: 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT',
        name: 'sbtc-token',
    },
    sbtcWithdrawal: {
        address: 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT',
        name: 'sbtc-withdrawal',
    },
    sbtcRegistry: {
        address: 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT',
        name: 'sbtc-registry',
    },
    zestMarket: exports.MAINNET_CONTRACTS.zestMarket,
    zestMarketVault: exports.MAINNET_CONTRACTS.zestMarketVault,
    zestVaultSbtc: exports.MAINNET_CONTRACTS.zestVaultSbtc,
    zestAssets: exports.MAINNET_CONTRACTS.zestAssets,
};
function getNetworkContracts(network) {
    return network === 'testnet' ? exports.TESTNET_CONTRACTS : exports.MAINNET_CONTRACTS;
}
function contractId(c) {
    return `${c.address}.${c.name}`;
}
