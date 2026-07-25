"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zestSbtcVaultInfo = zestSbtcVaultInfo;
exports.zestProtocolStatus = zestProtocolStatus;
exports.zestSupplySbtc = zestSupplySbtc;
exports.zestRedeemSbtc = zestRedeemSbtc;
exports.zestPosition = zestPosition;
exports.zestCollateralAddSbtc = zestCollateralAddSbtc;
exports.zestBorrow = zestBorrow;
exports.zestRepay = zestRepay;
const transactions_1 = require("@stacks/transactions");
const client_1 = require("../client");
const contracts_1 = require("../constants/contracts");
const amounts_1 = require("../utils/amounts");
const contracts_2 = require("./contracts");
const SBTC_FT = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';
function extractUint(value) {
    if (value == null)
        return 0n;
    if (typeof value === 'object' && value !== null && 'value' in value) {
        const inner = value.value;
        if (typeof inner === 'object' && inner !== null && 'value' in inner) {
            return BigInt(String(inner.value));
        }
        return BigInt(String(inner ?? 0));
    }
    return BigInt(String(value));
}
function senderAddress(senderKey, network) {
    return (0, transactions_1.getAddressFromPrivateKey)(senderKey, network);
}
async function readVault(network, functionName, functionArgsHex = []) {
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    return (0, contracts_2.readOnlyCall)({
        network,
        contractAddress: contracts.zestVaultSbtc.address,
        contractName: contracts.zestVaultSbtc.name,
        functionName,
        functionArgsHex,
    });
}
/** Read Zest sBTC vault utilization, interest rate, and liquidity. */
async function zestSbtcVaultInfo(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const [utilization, interestRate, available] = await Promise.all([
        readVault(network, 'get-utilization'),
        readVault(network, 'get-interest-rate'),
        readVault(network, 'get-available-assets'),
    ]);
    return {
        network,
        contract: (0, contracts_1.contractId)((0, contracts_1.getNetworkContracts)(network).zestVaultSbtc),
        utilization: utilization.value,
        interestRateBps: interestRate.value,
        availableAssets: available.value,
    };
}
/** Read Zest pause flags on the sBTC vault. */
async function zestProtocolStatus(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const pause = await readVault(network, 'get-pause-states');
    return {
        network,
        contract: (0, contracts_1.contractId)((0, contracts_1.getNetworkContracts)(network).zestVaultSbtc),
        pauseStates: pause.value,
    };
}
async function assertZestWritesAllowed(network) {
    const status = await zestProtocolStatus({ network });
    const paused = status.pauseStates;
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
async function zestSupplySbtc(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    await assertZestWritesAllowed(network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const amount = (0, amounts_1.parseSbtcAmount)(params.amount);
    const minOut = (0, amounts_1.parseSbtcAmount)(params.minOut ?? 0);
    const recipient = params.recipient ?? senderAddress(params.senderKey, network);
    return (0, contracts_2.contractCall)({
        network,
        senderKey: params.senderKey,
        fee: params.fee,
        nonce: params.nonce,
        contractAddress: contracts.zestVaultSbtc.address,
        contractName: contracts.zestVaultSbtc.name,
        functionName: 'deposit',
        functionArgsHex: [
            transactions_1.Cl.serialize(transactions_1.Cl.uint(amount)),
            transactions_1.Cl.serialize(transactions_1.Cl.uint(minOut)),
            transactions_1.Cl.serialize(transactions_1.Cl.principal(recipient)),
        ],
    });
}
/** Redeem zsBTC shares from Zest vault-sbtc for underlying sBTC. */
async function zestRedeemSbtc(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    await assertZestWritesAllowed(network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const shares = (0, amounts_1.parseSbtcAmount)(params.shares);
    const minUnderlying = (0, amounts_1.parseSbtcAmount)(params.minUnderlying ?? 0);
    const recipient = params.recipient ?? senderAddress(params.senderKey, network);
    return (0, contracts_2.contractCall)({
        network,
        senderKey: params.senderKey,
        fee: params.fee,
        nonce: params.nonce,
        contractAddress: contracts.zestVaultSbtc.address,
        contractName: contracts.zestVaultSbtc.name,
        functionName: 'redeem',
        functionArgsHex: [
            transactions_1.Cl.serialize(transactions_1.Cl.uint(shares)),
            transactions_1.Cl.serialize(transactions_1.Cl.uint(minUnderlying)),
            transactions_1.Cl.serialize(transactions_1.Cl.principal(recipient)),
        ],
    });
}
/** Read a user's Zest market position (collateral and debt). */
async function zestPosition(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const bitmap = await (0, contracts_2.readOnlyCall)({
        network,
        contractAddress: contracts.zestAssets.address,
        contractName: contracts.zestAssets.name,
        functionName: 'get-bitmap',
        senderAddress: params.address,
    });
    const enabledMask = extractUint(bitmap.value);
    const position = await (0, contracts_2.readOnlyCall)({
        network,
        contractAddress: contracts.zestMarketVault.address,
        contractName: contracts.zestMarketVault.name,
        functionName: 'get-position',
        functionArgsHex: [
            transactions_1.Cl.serialize(transactions_1.Cl.principal(params.address)),
            transactions_1.Cl.serialize(transactions_1.Cl.uint(enabledMask)),
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
async function zestCollateralAddSbtc(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    await assertZestWritesAllowed(network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const amount = (0, amounts_1.parseSbtcAmount)(params.amount);
    const ft = params.assetContract ?? SBTC_FT;
    const priceFeeds = params.priceFeedsHex?.length
        ? transactions_1.Cl.some(transactions_1.Cl.list(params.priceFeedsHex.map(h => transactions_1.Cl.bufferFromHex(h.replace(/^0x/, '')))))
        : transactions_1.Cl.none();
    return (0, contracts_2.contractCall)({
        network,
        senderKey: params.senderKey,
        fee: params.fee,
        nonce: params.nonce,
        contractAddress: contracts.zestMarket.address,
        contractName: contracts.zestMarket.name,
        functionName: 'collateral-add',
        functionArgsHex: [
            transactions_1.Cl.serialize(transactions_1.Cl.principal(ft)),
            transactions_1.Cl.serialize(transactions_1.Cl.uint(amount)),
            transactions_1.Cl.serialize(priceFeeds),
        ],
    });
}
/** Borrow an asset from Zest market against posted collateral. */
async function zestBorrow(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    await assertZestWritesAllowed(network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const amount = (0, amounts_1.parseSbtcAmount)(params.amount);
    const ft = params.assetContract;
    if (!ft)
        throw new Error('assetContract (borrow token principal) is required.');
    const receiverArg = params.receiver ? transactions_1.Cl.some(transactions_1.Cl.principal(params.receiver)) : transactions_1.Cl.none();
    const feedsArg = params.priceFeedsHex?.length
        ? transactions_1.Cl.some(transactions_1.Cl.list(params.priceFeedsHex.map(h => transactions_1.Cl.bufferFromHex(h.replace(/^0x/, '')))))
        : transactions_1.Cl.none();
    return (0, contracts_2.contractCall)({
        network,
        senderKey: params.senderKey,
        fee: params.fee,
        nonce: params.nonce,
        contractAddress: contracts.zestMarket.address,
        contractName: contracts.zestMarket.name,
        functionName: 'borrow',
        functionArgsHex: [
            transactions_1.Cl.serialize(transactions_1.Cl.principal(ft)),
            transactions_1.Cl.serialize(transactions_1.Cl.uint(amount)),
            transactions_1.Cl.serialize(receiverArg),
            transactions_1.Cl.serialize(feedsArg),
        ],
    });
}
/** Repay borrowed debt on Zest market. */
async function zestRepay(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    await assertZestWritesAllowed(network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const amount = (0, amounts_1.parseSbtcAmount)(params.amount);
    const ft = params.assetContract;
    if (!ft)
        throw new Error('assetContract (repay token principal) is required.');
    const feedsArg = params.priceFeedsHex?.length
        ? transactions_1.Cl.some(transactions_1.Cl.list(params.priceFeedsHex.map(h => transactions_1.Cl.bufferFromHex(h.replace(/^0x/, '')))))
        : transactions_1.Cl.none();
    return (0, contracts_2.contractCall)({
        network,
        senderKey: params.senderKey,
        fee: params.fee,
        nonce: params.nonce,
        contractAddress: contracts.zestMarket.address,
        contractName: contracts.zestMarket.name,
        functionName: 'repay',
        functionArgsHex: [
            transactions_1.Cl.serialize(transactions_1.Cl.principal(ft)),
            transactions_1.Cl.serialize(transactions_1.Cl.uint(amount)),
            transactions_1.Cl.serialize(feedsArg),
        ],
    });
}
