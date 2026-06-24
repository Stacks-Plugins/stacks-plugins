import { broadcastTransaction, Cl, getAddressFromPrivateKey, makeContractCall, Pc, PostConditionMode, } from '@stacks/transactions';
import { buildSbtcDepositAddress, MAINNET, SbtcApiClientMainnet, SbtcApiClientTestnet, sbtcDepositHelper, TESTNET, } from 'sbtc';
import { fetchFn, resolveNetwork } from '../client';
import { contractId, getNetworkContracts } from '../constants/contracts';
import { parseSbtcAmount } from '../utils/amounts';
import { btcAddressToRecipient } from '../utils/btcAddress';
import { bitcoinPrivateKeyBytes, bitcoinReclaimPublicKeyHex, getBitcoinAddress, getBitcoinPrivateKey, } from '../utils/btcKeys';
import { readOnlyCall } from './contracts';
function sbtcClient(network) {
    return network === 'testnet' ? new SbtcApiClientTestnet() : new SbtcApiClientMainnet();
}
function btcNetwork(network) {
    return network === 'testnet' ? TESTNET : MAINNET;
}
function stacksAddressFromKey(senderKey, network) {
    return getAddressFromPrivateKey(senderKey, network);
}
/** Fetch sBTC balance for a Stacks address via sbtc-token get-balance. */
export async function sbtcGetBalance(params) {
    const network = resolveNetwork(params.network);
    const contracts = getNetworkContracts(network);
    const balance = await readOnlyCall({
        network,
        contractAddress: contracts.sbtcToken.address,
        contractName: contracts.sbtcToken.name,
        functionName: 'get-balance',
        functionArgsHex: [Cl.serialize(Cl.principal(params.address))],
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
export async function sendSbtc(params) {
    const network = resolveNetwork(params.network);
    const contracts = getNetworkContracts(network);
    const amount = parseSbtcAmount(params.amount);
    const sender = stacksAddressFromKey(params.senderKey, network);
    if (sender === params.recipient) {
        throw new Error('Recipient cannot equal sender: sBTC self-transfers have zero net token change and fail strict post-conditions (SentEq 0). Use a different recipient address.');
    }
    const callOptions = {
        contractAddress: contracts.sbtcToken.address,
        contractName: contracts.sbtcToken.name,
        functionName: 'transfer',
        functionArgs: [
            Cl.uint(amount),
            Cl.principal(sender),
            Cl.principal(params.recipient),
            params.memo
                ? Cl.some(Cl.buffer(Buffer.from(params.memo, 'utf8').slice(0, 34)))
                : Cl.none(),
        ],
        senderKey: params.senderKey,
        network,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
            Pc.principal(sender)
                .willSendEq(amount)
                .ft(contractId(contracts.sbtcToken), 'sbtc-token'),
        ],
    };
    if (params.fee != null)
        callOptions.fee = BigInt(params.fee);
    if (params.nonce != null)
        callOptions.nonce = BigInt(params.nonce);
    const transaction = await makeContractCall(callOptions);
    const result = await broadcastTransaction({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
/** Build an sBTC peg-in deposit address and metadata (no Bitcoin broadcast). */
export async function sbtcBuildPegIn(params) {
    const network = resolveNetwork(params.network);
    const contracts = getNetworkContracts(network);
    const client = sbtcClient(network);
    const signersPublicKey = await client.fetchSignersPublicKey(contracts.sbtcRegistry.address);
    const reclaimPublicKey = params.reclaimPublicKey ?? bitcoinReclaimPublicKeyHex(params.bitcoinPrivateKey);
    const deposit = buildSbtcDepositAddress({
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
export async function sbtcInitiatePegIn(params) {
    const network = resolveNetwork(params.network);
    const contracts = getNetworkContracts(network);
    const client = sbtcClient(network);
    const bitcoinAddress = params.bitcoinAddress ?? getBitcoinAddress();
    const bitcoinPrivateKey = params.bitcoinPrivateKey ?? getBitcoinPrivateKey();
    const stacksAddress = params.stacksAddress ??
        (params.senderKey ? stacksAddressFromKey(params.senderKey, network) : undefined);
    if (!stacksAddress) {
        throw new Error('stacksAddress or senderKey is required to receive minted sBTC on Stacks.');
    }
    const amountSats = Number(parseSbtcAmount(params.amount));
    if (amountSats <= 0)
        throw new Error('Peg-in amount must be greater than zero.');
    const signersPublicKey = await client.fetchSignersPublicKey(contracts.sbtcRegistry.address);
    const reclaimPublicKey = bitcoinReclaimPublicKeyHex(bitcoinPrivateKey);
    const feeRate = params.feeRate ?? (await client.fetchFeeRate('medium'));
    const utxos = await client.fetchUtxos(bitcoinAddress);
    const deposit = await sbtcDepositHelper({
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
    deposit.transaction.sign(bitcoinPrivateKeyBytes(bitcoinPrivateKey));
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
export async function sbtcInitiatePegOut(params) {
    const network = resolveNetwork(params.network);
    const contracts = getNetworkContracts(network);
    const amount = parseSbtcAmount(params.amount);
    const maxFee = parseSbtcAmount(params.maxFee ?? params.maxSignerFee ?? 3000);
    const sender = stacksAddressFromKey(params.senderKey, network);
    const recipient = btcAddressToRecipient(params.bitcoinRecipient, network);
    const callOptions = {
        contractAddress: contracts.sbtcWithdrawal.address,
        contractName: contracts.sbtcWithdrawal.name,
        functionName: 'initiate-withdrawal-request',
        functionArgs: [Cl.uint(amount), Cl.tuple(recipient), Cl.uint(maxFee)],
        senderKey: params.senderKey,
        network,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
            Pc.principal(sender)
                .willSendEq(amount + maxFee)
                .ft(contractId(contracts.sbtcToken), 'sbtc-token'),
        ],
    };
    if (params.fee != null)
        callOptions.fee = BigInt(params.fee);
    if (params.nonce != null)
        callOptions.nonce = BigInt(params.nonce);
    const transaction = await makeContractCall(callOptions);
    const result = await broadcastTransaction({ transaction, network });
    if ('error' in result) {
        const err = result;
        return { txid: err.txid ?? '', success: false, error: err.error, reason: err.reason };
    }
    return { txid: result.txid, success: true };
}
/** Poll Emily for peg-in deposit status or list withdrawals for a Stacks sender. */
export async function sbtcGetPegStatus(params) {
    const network = resolveNetwork(params.network);
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
        const res = await fetchFn(`${baseUrl}/withdrawal/sender/${encodeURIComponent(params.stacksAddress)}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch withdrawal status for ${params.stacksAddress}: ${res.status} ${res.statusText}`);
        }
        const withdrawals = await res.json();
        return { kind: 'withdrawals', network, stacksAddress: params.stacksAddress, withdrawals };
    }
    throw new Error('Provide bitcoinTxid or stacksAddress to query peg status.');
}
