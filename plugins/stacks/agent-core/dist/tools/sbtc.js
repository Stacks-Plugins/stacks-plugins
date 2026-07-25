"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sbtcGetBalance = sbtcGetBalance;
exports.sendSbtc = sendSbtc;
exports.sbtcBuildPegIn = sbtcBuildPegIn;
exports.sbtcInitiatePegIn = sbtcInitiatePegIn;
exports.sbtcInitiatePegOut = sbtcInitiatePegOut;
exports.sbtcGetPegStatus = sbtcGetPegStatus;
const transactions_1 = require("@stacks/transactions");
const sbtc_1 = require("sbtc");
const client_1 = require("../client");
const contracts_1 = require("../constants/contracts");
const amounts_1 = require("../utils/amounts");
const btcAddress_1 = require("../utils/btcAddress");
const btcKeys_1 = require("../utils/btcKeys");
const contracts_2 = require("./contracts");
function sbtcClient(network) {
    return network === 'testnet' ? new sbtc_1.SbtcApiClientTestnet() : new sbtc_1.SbtcApiClientMainnet();
}
function btcNetwork(network) {
    return network === 'testnet' ? sbtc_1.TESTNET : sbtc_1.MAINNET;
}
function stacksAddressFromKey(senderKey, network) {
    return (0, transactions_1.getAddressFromPrivateKey)(senderKey, network);
}
/** Fetch sBTC balance for a Stacks address via sbtc-token get-balance. */
async function sbtcGetBalance(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const balance = await (0, contracts_2.readOnlyCall)({
        network,
        contractAddress: contracts.sbtcToken.address,
        contractName: contracts.sbtcToken.name,
        functionName: 'get-balance',
        functionArgsHex: [transactions_1.Cl.serialize(transactions_1.Cl.principal(params.address))],
        senderAddress: params.address,
    });
    const raw = balance.value;
    let sbtc = '0';
    if (raw?.type === 'uint' && raw.value != null && typeof raw.value !== 'object') {
        sbtc = String(raw.value);
    }
    else if (raw?.value != null && typeof raw.value === 'object' && 'value' in raw.value) {
        sbtc = String(raw.value.value ?? '0');
    }
    else if (raw?.value != null && typeof raw.value !== 'object') {
        sbtc = String(raw.value);
    }
    else if (balance.value != null) {
        sbtc = String(balance.value);
    }
    return {
        address: params.address,
        network,
        sbtc,
    };
}
/** Transfer sBTC (SIP-010) to another Stacks address. Amount in base units (8 decimals). */
async function sendSbtc(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const amount = (0, amounts_1.parseSbtcAmount)(params.amount);
    const sender = stacksAddressFromKey(params.senderKey, network);
    if (sender === params.recipient) {
        throw new Error('Recipient cannot equal sender: sBTC self-transfers have zero net token change and fail strict post-conditions (SentEq 0). Use a different recipient address.');
    }
    const callOptions = {
        contractAddress: contracts.sbtcToken.address,
        contractName: contracts.sbtcToken.name,
        functionName: 'transfer',
        functionArgs: [
            transactions_1.Cl.uint(amount),
            transactions_1.Cl.principal(sender),
            transactions_1.Cl.principal(params.recipient),
            params.memo
                ? transactions_1.Cl.some(transactions_1.Cl.buffer(Buffer.from(params.memo, 'utf8').slice(0, 34)))
                : transactions_1.Cl.none(),
        ],
        senderKey: params.senderKey,
        network,
        postConditionMode: transactions_1.PostConditionMode.Deny,
        postConditions: [
            transactions_1.Pc.principal(sender)
                .willSendEq(amount)
                .ft((0, contracts_1.contractId)(contracts.sbtcToken), 'sbtc-token'),
        ],
    };
    if (params.fee != null)
        callOptions.fee = BigInt(params.fee);
    if (params.nonce != null)
        callOptions.nonce = BigInt(params.nonce);
    const transaction = await (0, transactions_1.makeContractCall)(callOptions);
    const result = await (0, transactions_1.broadcastTransaction)({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
/** Build an sBTC peg-in deposit address and metadata (no Bitcoin broadcast). */
async function sbtcBuildPegIn(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const client = sbtcClient(network);
    const signersPublicKey = await client.fetchSignersPublicKey(contracts.sbtcRegistry.address);
    const reclaimPublicKey = params.reclaimPublicKey ?? (0, btcKeys_1.bitcoinReclaimPublicKeyHex)(params.bitcoinPrivateKey);
    const deposit = (0, sbtc_1.buildSbtcDepositAddress)({
        network: btcNetwork(network),
        stacksAddress: params.stacksAddress,
        signersPublicKey,
        maxSignerFee: params.maxSignerFee ?? 80000,
        reclaimLockTime: params.reclaimLockTime ?? 950,
        reclaimPublicKey,
    });
    return {
        network,
        stacksAddress: params.stacksAddress,
        depositAddress: deposit.address,
        depositScript: deposit.depositScript,
        reclaimScript: deposit.reclaimScript,
        signersPublicKey,
        maxSignerFee: params.maxSignerFee ?? 80000,
        reclaimLockTime: params.reclaimLockTime ?? 950,
    };
}
/** Peg BTC in: build, sign, broadcast Bitcoin tx, and notify Emily. */
async function sbtcInitiatePegIn(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const client = sbtcClient(network);
    const bitcoinAddress = params.bitcoinAddress ?? (0, btcKeys_1.getBitcoinAddress)();
    const bitcoinPrivateKey = params.bitcoinPrivateKey ?? (0, btcKeys_1.getBitcoinPrivateKey)();
    const stacksAddress = params.stacksAddress ??
        (params.senderKey ? stacksAddressFromKey(params.senderKey, network) : undefined);
    if (!stacksAddress) {
        throw new Error('stacksAddress or senderKey is required to receive minted sBTC on Stacks.');
    }
    const amountSats = Number((0, amounts_1.parseSbtcAmount)(params.amount));
    if (amountSats <= 0)
        throw new Error('Peg-in amount must be greater than zero.');
    const signersPublicKey = await client.fetchSignersPublicKey(contracts.sbtcRegistry.address);
    const reclaimPublicKey = (0, btcKeys_1.bitcoinReclaimPublicKeyHex)(bitcoinPrivateKey);
    const feeRate = params.feeRate ?? (await client.fetchFeeRate('medium'));
    const utxos = await client.fetchUtxos(bitcoinAddress);
    const deposit = await (0, sbtc_1.sbtcDepositHelper)({
        network: btcNetwork(network),
        amountSats,
        stacksAddress,
        signersPublicKey,
        feeRate,
        utxos,
        bitcoinChangeAddress: bitcoinAddress,
        reclaimPublicKey,
        maxSignerFee: params.maxSignerFee ?? 80000,
        reclaimLockTime: params.reclaimLockTime ?? 950,
        paymentPublicKey: reclaimPublicKey,
    });
    deposit.transaction.sign((0, btcKeys_1.bitcoinPrivateKeyBytes)(bitcoinPrivateKey));
    deposit.transaction.finalize();
    const bitcoinTxid = await client.broadcastTx(deposit.transaction);
    const notify = await client.notifySbtc(deposit);
    return {
        success: true,
        network,
        stacksAddress,
        bitcoinTxid,
        depositAddress: deposit.address,
        emilyStatus: notify.status,
        emilyMessage: notify.statusMessage,
        notify,
    };
}
/** Initiate sBTC peg-out (withdraw sBTC for BTC on L1). */
async function sbtcInitiatePegOut(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const contracts = (0, contracts_1.getNetworkContracts)(network);
    const amount = (0, amounts_1.parseSbtcAmount)(params.amount);
    const maxFee = (0, amounts_1.parseSbtcAmount)(params.maxFee ?? params.maxSignerFee ?? 3000);
    const sender = stacksAddressFromKey(params.senderKey, network);
    const recipient = (0, btcAddress_1.btcAddressToRecipient)(params.bitcoinRecipient, network);
    const callOptions = {
        contractAddress: contracts.sbtcWithdrawal.address,
        contractName: contracts.sbtcWithdrawal.name,
        functionName: 'initiate-withdrawal-request',
        functionArgs: [transactions_1.Cl.uint(amount), transactions_1.Cl.tuple(recipient), transactions_1.Cl.uint(maxFee)],
        senderKey: params.senderKey,
        network,
        postConditionMode: transactions_1.PostConditionMode.Deny,
        postConditions: [
            transactions_1.Pc.principal(sender)
                .willSendEq(amount + maxFee)
                .ft((0, contracts_1.contractId)(contracts.sbtcToken), 'sbtc-token'),
        ],
    };
    if (params.fee != null)
        callOptions.fee = BigInt(params.fee);
    if (params.nonce != null)
        callOptions.nonce = BigInt(params.nonce);
    const transaction = await (0, transactions_1.makeContractCall)(callOptions);
    const result = await (0, transactions_1.broadcastTransaction)({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
/** Poll Emily for peg-in deposit status or list withdrawals for a Stacks sender. */
async function sbtcGetPegStatus(params) {
    const network = (0, client_1.resolveNetwork)(params.network);
    const client = sbtcClient(network);
    if (params.bitcoinTxid) {
        const deposit = await client.fetchDeposit({
            txid: params.bitcoinTxid.replace(/^0x/, ''),
            vout: params.vout ?? 0,
        });
        return { kind: 'deposit', network, deposit };
    }
    if (params.stacksAddress) {
        const baseUrl = client.config?.sbtcApiUrl ?? 'https://sbtc-emily.com';
        const res = await (0, client_1.fetchFn)(`${baseUrl}/withdrawal/sender/${encodeURIComponent(params.stacksAddress)}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch withdrawal status for ${params.stacksAddress}: ${res.status} ${res.statusText}`);
        }
        const withdrawals = await res.json();
        return { kind: 'withdrawals', network, stacksAddress: params.stacksAddress, withdrawals };
    }
    throw new Error('Provide bitcoinTxid or stacksAddress to query peg status.');
}
