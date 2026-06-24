import { Cl, getAddressFromPrivateKey } from '@stacks/transactions';
import { resolveNetwork } from '../client';
import { contractId, getNetworkContracts } from '../constants/contracts';
import {
  BroadcastResult,
  ZestBorrowParams,
  ZestCollateralAddSbtcParams,
  ZestPositionParams,
  ZestPositionResult,
  ZestProtocolStatusParams,
  ZestProtocolStatusResult,
  ZestRedeemSbtcParams,
  ZestRepayParams,
  ZestSbtcVaultInfoParams,
  ZestSbtcVaultInfoResult,
  ZestSupplySbtcParams,
} from '../types';
import { parseSbtcAmount } from '../utils/amounts';
import { contractCall, readOnlyCall } from './contracts';

const SBTC_FT = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';

function extractUint(value: unknown): bigint {
  if (value == null) return 0n;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    const inner = (value as { value?: unknown }).value;
    if (typeof inner === 'object' && inner !== null && 'value' in inner) {
      return BigInt(String((inner as { value: string | number }).value));
    }
    return BigInt(String(inner ?? 0));
  }
  return BigInt(String(value));
}

function senderAddress(senderKey: string, network: ReturnType<typeof resolveNetwork>): string {
  return getAddressFromPrivateKey(senderKey, network);
}

async function readVault(
  network: ReturnType<typeof resolveNetwork>,
  functionName: string,
  functionArgsHex: string[] = []
) {
  const contracts = getNetworkContracts(network);
  return readOnlyCall({
    network,
    contractAddress: contracts.zestVaultSbtc.address,
    contractName: contracts.zestVaultSbtc.name,
    functionName,
    functionArgsHex,
  });
}

/** Read Zest sBTC vault utilization, interest rate, and liquidity. */
export async function zestSbtcVaultInfo(
  params: ZestSbtcVaultInfoParams
): Promise<ZestSbtcVaultInfoResult> {
  const network = resolveNetwork(params.network);
  const [utilization, interestRate, available] = await Promise.all([
    readVault(network, 'get-utilization'),
    readVault(network, 'get-interest-rate'),
    readVault(network, 'get-available-assets'),
  ]);

  return {
    network,
    contract: contractId(getNetworkContracts(network).zestVaultSbtc),
    utilization: utilization.value,
    interestRateBps: interestRate.value,
    availableAssets: available.value,
  };
}

/** Read Zest pause flags on the sBTC vault. */
export async function zestProtocolStatus(
  params: ZestProtocolStatusParams
): Promise<ZestProtocolStatusResult> {
  const network = resolveNetwork(params.network);
  const pause = await readVault(network, 'get-pause-states');
  return {
    network,
    contract: contractId(getNetworkContracts(network).zestVaultSbtc),
    pauseStates: pause.value,
  };
}

async function assertZestWritesAllowed(network: ReturnType<typeof resolveNetwork>) {
  const status = await zestProtocolStatus({ network });
  const paused = status.pauseStates as Record<string, unknown> | boolean | undefined;
  if (paused === true) {
    throw new Error('Zest Protocol vault is paused. Refusing write operation.');
  }
  if (paused && typeof paused === 'object') {
    const anyPaused = Object.values(paused).some(v => v === true);
    if (anyPaused) {
      throw new Error('Zest Protocol vault reports paused state. Refusing write operation.');
    }
  }
}

/** Supply sBTC to Zest vault-sbtc and receive zsBTC shares. */
export async function zestSupplySbtc(params: ZestSupplySbtcParams): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);
  await assertZestWritesAllowed(network);
  const contracts = getNetworkContracts(network);
  const amount = parseSbtcAmount(params.amount);
  const minOut = parseSbtcAmount(params.minOut ?? 0);
  const recipient = params.recipient ?? senderAddress(params.senderKey, network);

  return contractCall({
    network,
    senderKey: params.senderKey,
    fee: params.fee,
    nonce: params.nonce,
    contractAddress: contracts.zestVaultSbtc.address,
    contractName: contracts.zestVaultSbtc.name,
    functionName: 'deposit',
    functionArgsHex: [
      Cl.serialize(Cl.uint(amount)),
      Cl.serialize(Cl.uint(minOut)),
      Cl.serialize(Cl.principal(recipient)),
    ],
  });
}

/** Redeem zsBTC shares from Zest vault-sbtc for underlying sBTC. */
export async function zestRedeemSbtc(params: ZestRedeemSbtcParams): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);
  await assertZestWritesAllowed(network);
  const contracts = getNetworkContracts(network);
  const shares = parseSbtcAmount(params.shares);
  const minUnderlying = parseSbtcAmount(params.minUnderlying ?? 0);
  const recipient = params.recipient ?? senderAddress(params.senderKey, network);

  return contractCall({
    network,
    senderKey: params.senderKey,
    fee: params.fee,
    nonce: params.nonce,
    contractAddress: contracts.zestVaultSbtc.address,
    contractName: contracts.zestVaultSbtc.name,
    functionName: 'redeem',
    functionArgsHex: [
      Cl.serialize(Cl.uint(shares)),
      Cl.serialize(Cl.uint(minUnderlying)),
      Cl.serialize(Cl.principal(recipient)),
    ],
  });
}

/** Read a user's Zest market position (collateral and debt). */
export async function zestPosition(params: ZestPositionParams): Promise<ZestPositionResult> {
  const network = resolveNetwork(params.network);
  const contracts = getNetworkContracts(network);
  const bitmap = await readOnlyCall({
    network,
    contractAddress: contracts.zestAssets.address,
    contractName: contracts.zestAssets.name,
    functionName: 'get-bitmap',
    senderAddress: params.address,
  });
  const enabledMask = extractUint(bitmap.value);

  const position = await readOnlyCall({
    network,
    contractAddress: contracts.zestMarketVault.address,
    contractName: contracts.zestMarketVault.name,
    functionName: 'get-position',
    functionArgsHex: [
      Cl.serialize(Cl.principal(params.address)),
      Cl.serialize(Cl.uint(enabledMask)),
    ],
    senderAddress: params.address,
  });

  return {
    network,
    address: params.address,
    position: position.value,
  };
}

/** Add sBTC as collateral on Zest market (for borrowing). */
export async function zestCollateralAddSbtc(
  params: ZestCollateralAddSbtcParams
): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);
  await assertZestWritesAllowed(network);
  const contracts = getNetworkContracts(network);
  const amount = parseSbtcAmount(params.amount);
  const ft = params.assetContract ?? SBTC_FT;

  const priceFeeds = params.priceFeedsHex?.length
    ? Cl.some(
        Cl.list(
          params.priceFeedsHex.map(h => Cl.bufferFromHex(h.replace(/^0x/, ''))) as [
            ReturnType<typeof Cl.bufferFromHex>,
            ...ReturnType<typeof Cl.bufferFromHex>[],
          ]
        )
      )
    : Cl.none();

  return contractCall({
    network,
    senderKey: params.senderKey,
    fee: params.fee,
    nonce: params.nonce,
    contractAddress: contracts.zestMarket.address,
    contractName: contracts.zestMarket.name,
    functionName: 'collateral-add',
    functionArgsHex: [
      Cl.serialize(Cl.principal(ft)),
      Cl.serialize(Cl.uint(amount)),
      Cl.serialize(priceFeeds),
    ],
  });
}

/** Borrow an asset from Zest market against posted collateral. */
export async function zestBorrow(params: ZestBorrowParams): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);
  await assertZestWritesAllowed(network);
  const contracts = getNetworkContracts(network);
  const amount = parseSbtcAmount(params.amount);
  const ft = params.assetContract;
  if (!ft) throw new Error('assetContract (borrow token principal) is required.');

  const receiverArg = params.receiver ? Cl.some(Cl.principal(params.receiver)) : Cl.none();
  const feedsArg = params.priceFeedsHex?.length
    ? Cl.some(
        Cl.list(
          params.priceFeedsHex.map(h => Cl.bufferFromHex(h.replace(/^0x/, ''))) as [
            ReturnType<typeof Cl.bufferFromHex>,
            ...ReturnType<typeof Cl.bufferFromHex>[],
          ]
        )
      )
    : Cl.none();

  return contractCall({
    network,
    senderKey: params.senderKey,
    fee: params.fee,
    nonce: params.nonce,
    contractAddress: contracts.zestMarket.address,
    contractName: contracts.zestMarket.name,
    functionName: 'borrow',
    functionArgsHex: [
      Cl.serialize(Cl.principal(ft)),
      Cl.serialize(Cl.uint(amount)),
      Cl.serialize(receiverArg),
      Cl.serialize(feedsArg),
    ],
  });
}

/** Repay borrowed debt on Zest market. */
export async function zestRepay(params: ZestRepayParams): Promise<BroadcastResult> {
  const network = resolveNetwork(params.network);
  await assertZestWritesAllowed(network);
  const contracts = getNetworkContracts(network);
  const amount = parseSbtcAmount(params.amount);
  const ft = params.assetContract;
  if (!ft) throw new Error('assetContract (repay token principal) is required.');

  const feedsArg = params.priceFeedsHex?.length
    ? Cl.some(
        Cl.list(
          params.priceFeedsHex.map(h => Cl.bufferFromHex(h.replace(/^0x/, ''))) as [
            ReturnType<typeof Cl.bufferFromHex>,
            ...ReturnType<typeof Cl.bufferFromHex>[],
          ]
        )
      )
    : Cl.none();

  return contractCall({
    network,
    senderKey: params.senderKey,
    fee: params.fee,
    nonce: params.nonce,
    contractAddress: contracts.zestMarket.address,
    contractName: contracts.zestMarket.name,
    functionName: 'repay',
    functionArgsHex: [
      Cl.serialize(Cl.principal(ft)),
      Cl.serialize(Cl.uint(amount)),
      Cl.serialize(feedsArg),
    ],
  });
}
