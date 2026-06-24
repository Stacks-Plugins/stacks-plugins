import { NetworkArg } from '../types';

const ZEST_DEPLOYER = 'SP1A27KFY4XERQCCRCARCYD1CC5N7M6688BSYADJ7';

export const MAINNET_CONTRACTS = {
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
} as const;

export const TESTNET_CONTRACTS = {
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
  zestMarket: MAINNET_CONTRACTS.zestMarket,
  zestMarketVault: MAINNET_CONTRACTS.zestMarketVault,
  zestVaultSbtc: MAINNET_CONTRACTS.zestVaultSbtc,
  zestAssets: MAINNET_CONTRACTS.zestAssets,
} as const;

export type NetworkContracts = typeof MAINNET_CONTRACTS | typeof TESTNET_CONTRACTS;

export function getNetworkContracts(network?: NetworkArg): NetworkContracts {
  return network === 'testnet' ? TESTNET_CONTRACTS : MAINNET_CONTRACTS;
}

export function contractId(c: { address: string; name: string }): string {
  return `${c.address}.${c.name}`;
}
