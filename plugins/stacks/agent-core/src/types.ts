import { StacksNetworkName } from '@stacks/network';

/** Network selector accepted by every tool. Defaults to `mainnet`. */
export type NetworkArg = StacksNetworkName;

/** Common params present on every tool call. */
export interface BaseParams {
  /** The target network. Defaults to `mainnet`. */
  network?: NetworkArg;
}

/** Params for tools that broadcast a transaction and therefore require a signing key. */
export interface SignedParams extends BaseParams {
  /** Hex-encoded sender private key used to sign and broadcast the transaction. */
  senderKey: string;
  /** Optional explicit fee in microSTX. Estimated automatically when omitted. */
  fee?: string | number;
  /** Optional explicit nonce. Fetched automatically when omitted. */
  nonce?: string | number;
}

export interface GetBalanceParams extends BaseParams {
  /** Stacks (c32) address to query. */
  address: string;
}

export interface BalanceResult {
  address: string;
  network: NetworkArg;
  /** Liquid (spendable) STX balance in microSTX. */
  stx: string;
  /** STX currently locked by stacking, in microSTX. */
  locked: string;
  totalSent: string;
  totalReceived: string;
  /** Fungible token balances keyed by `address.contract::asset`. */
  fungibleTokens: Record<string, { balance: string }>;
  /** Non-fungible token counts keyed by asset identifier. */
  nonFungibleTokens: Record<string, { count: string }>;
}

export interface SendTokensParams extends SignedParams {
  /** Recipient Stacks address. */
  recipient: string;
  /** Amount to send in microSTX. */
  amount: string | number;
  /** Optional on-chain memo (max 34 bytes). */
  memo?: string;
}

export interface BroadcastResult {
  txid: string;
  /** True when the node accepted the transaction. */
  success: boolean;
  /** Present when the broadcast was rejected. */
  error?: string;
  reason?: string;
}

export interface AccountHistoryParams extends BaseParams {
  address: string;
  /** Page size (default 20, max 50). */
  limit?: number;
  /** Result offset for pagination. */
  offset?: number;
}

export interface AccountHistoryResult {
  address: string;
  network: NetworkArg;
  total: number;
  limit: number;
  offset: number;
  transactions: unknown[];
}

export interface StackingStatusParams extends BaseParams {
  address: string;
}

export interface CanStackParams extends BaseParams {
  address: string;
  /** Amount of STX to lock, in microSTX. */
  amount: string | number;
  /** Number of reward cycles to lock for. */
  cycles: number;
  /** BTC reward address that PoX rewards are paid to. */
  poxAddress: string;
}

export interface StackParams extends SignedParams {
  /** Amount of STX to lock, in microSTX. */
  amount: string | number;
  /** Number of reward cycles to lock for. */
  cycles: number;
  /** BTC reward address that PoX rewards are paid to. */
  poxAddress: string;
  /** Burnchain block height at which to start stacking. Defaults to the next cycle. */
  burnBlockHeight?: number;
}

export interface DelegateStxParams extends SignedParams {
  /** Maximum amount the delegate may lock on your behalf, in microSTX. */
  amount: string | number;
  /** Address of the pool/delegate operator. */
  delegateTo: string;
  /** Optional burnchain height after which the delegation expires. */
  untilBurnBlockHeight?: number;
  /** Optional BTC reward address the delegate must use. */
  poxAddress?: string;
}

export interface RevokeDelegateParams extends SignedParams {}

export interface ResolveNameParams extends BaseParams {
  /** Fully-qualified BNS name, e.g. `muneeb.id`. */
  name: string;
}

export interface ResolveNameResult {
  name: string;
  network: NetworkArg;
  address?: string;
  zonefile?: string;
  expireBlock?: number;
  status?: string;
  found: boolean;
}

export interface LookupAddressParams extends BaseParams {
  address: string;
}

export interface LookupAddressResult {
  address: string;
  network: NetworkArg;
  names: string[];
}

export interface NamePriceParams extends BaseParams {
  /** Fully-qualified BNS name to price, e.g. `myname.btc`. */
  name: string;
}

export interface NamePriceResult {
  name: string;
  network: NetworkArg;
  /** Registration price in microSTX. */
  amount: string;
}

export interface ContractCallParams extends SignedParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  /** Clarity function arguments encoded as hex strings (serialized ClarityValues). */
  functionArgsHex?: string[];
}

export interface ReadOnlyCallParams extends BaseParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgsHex?: string[];
  /** Address used as `tx-sender` for the read-only evaluation. */
  senderAddress?: string;
}

export interface ReadOnlyCallResult {
  /** JSON representation of the returned Clarity value. */
  value: unknown;
  /** Hex-encoded serialized Clarity value. */
  hex: string;
}

export interface DecodeCvParams {
  /** Hex-encoded serialized Clarity value. */
  hex: string;
}

export interface SwapQuoteParams extends BaseParams {
  /** Token identifier to swap from, e.g. `STX` or `SP...::token`. */
  tokenFrom: string;
  /** Token identifier to swap to. */
  tokenTo: string;
  /** Input amount in the smallest unit of `tokenFrom`. */
  amount: string | number;
}

export interface SwapQuoteResult {
  tokenFrom: string;
  tokenTo: string;
  amountIn: string;
  amountOut: string;
  /** Route of pool/token ids the swap passes through. */
  route: string[];
  network: NetworkArg;
}

export interface SwapExecuteParams extends SignedParams {
  tokenFrom: string;
  tokenTo: string;
  amount: string | number;
  /** Minimum acceptable output amount (slippage protection). */
  minAmountOut: string | number;
}

export interface BridgeQuoteParams extends BaseParams {
  /** Source chain, e.g. `stacks`, `ethereum`, `bsc`. */
  fromChain: string;
  /** Destination chain. */
  toChain: string;
  /** Token symbol to bridge, e.g. `USDC`, `aBTC`. */
  token: string;
  /** Amount in the token's smallest unit. */
  amount: string | number;
}

export interface BridgeQuoteResult {
  fromChain: string;
  toChain: string;
  token: string;
  amountIn: string;
  amountOut: string;
  /** Estimated bridge fee in the token's smallest unit. */
  fee: string;
  provider: string;
}

export interface BridgeInitiateParams extends SignedParams {
  fromChain: string;
  toChain: string;
  token: string;
  amount: string | number;
  /** Recipient address on the destination chain. */
  recipient: string;
}

export interface SbtcGetBalanceParams extends BaseParams {
  address: string;
}

export interface SbtcGetBalanceResult {
  address: string;
  network: NetworkArg;
  /** sBTC balance in base units (8 decimals). */
  sbtc: string;
}

export interface SendSbtcParams extends SignedParams {
  recipient: string;
  amount: string | number;
  memo?: string;
}

export interface SbtcBuildPegInParams extends BaseParams {
  stacksAddress: string;
  maxSignerFee?: number;
  reclaimLockTime?: number;
  reclaimPublicKey?: string;
  bitcoinPrivateKey?: string;
}

export interface SbtcBuildPegInResult {
  network: NetworkArg;
  stacksAddress: string;
  depositAddress: string;
  depositScript: string;
  reclaimScript: string;
  signersPublicKey: string;
  maxSignerFee: number;
  reclaimLockTime: number;
}

export interface SbtcInitiatePegInParams extends BaseParams {
  amount: string | number;
  stacksAddress?: string;
  senderKey?: string;
  bitcoinAddress?: string;
  bitcoinPrivateKey?: string;
  maxSignerFee?: number;
  reclaimLockTime?: number;
  feeRate?: number;
}

export interface SbtcInitiatePegInResult {
  success: boolean;
  network: NetworkArg;
  stacksAddress: string;
  bitcoinTxid: string;
  depositAddress: string;
  emilyStatus: string;
  emilyMessage: string;
  notify: unknown;
}

export interface SbtcInitiatePegOutParams extends SignedParams {
  amount: string | number;
  bitcoinRecipient: string;
  maxFee?: string | number;
  maxSignerFee?: string | number;
}

export interface SbtcGetPegStatusParams extends BaseParams {
  bitcoinTxid?: string;
  vout?: number;
  stacksAddress?: string;
}

export interface SbtcGetPegStatusResult {
  kind: 'deposit' | 'withdrawals';
  network: NetworkArg;
  deposit?: unknown;
  stacksAddress?: string;
  withdrawals?: unknown;
}

export interface ZestSbtcVaultInfoParams extends BaseParams {}

export interface ZestSbtcVaultInfoResult {
  network: NetworkArg;
  contract: string;
  utilization: unknown;
  interestRateBps: unknown;
  availableAssets: unknown;
}

export interface ZestProtocolStatusParams extends BaseParams {}

export interface ZestProtocolStatusResult {
  network: NetworkArg;
  contract: string;
  pauseStates: unknown;
}

export interface ZestSupplySbtcParams extends SignedParams {
  amount: string | number;
  minOut?: string | number;
  recipient?: string;
}

export interface ZestRedeemSbtcParams extends SignedParams {
  shares: string | number;
  minUnderlying?: string | number;
  recipient?: string;
}

export interface ZestPositionParams extends BaseParams {
  address: string;
}

export interface ZestPositionResult {
  network: NetworkArg;
  address: string;
  position: unknown;
}

export interface ZestCollateralAddSbtcParams extends SignedParams {
  amount: string | number;
  assetContract?: string;
  priceFeedsHex?: string[];
}

export interface ZestBorrowParams extends SignedParams {
  assetContract: string;
  amount: string | number;
  receiver?: string;
  priceFeedsHex?: string[];
}

export interface ZestRepayParams extends SignedParams {
  assetContract: string;
  amount: string | number;
  priceFeedsHex?: string[];
}
