import { BroadcastResult, SbtcBuildPegInParams, SbtcBuildPegInResult, SbtcGetBalanceParams, SbtcGetBalanceResult, SbtcGetPegStatusParams, SbtcGetPegStatusResult, SbtcInitiatePegInParams, SbtcInitiatePegInResult, SbtcInitiatePegOutParams, SendSbtcParams } from '../types';
/** Fetch sBTC balance for a Stacks address via sbtc-token get-balance. */
export declare function sbtcGetBalance(params: SbtcGetBalanceParams): Promise<SbtcGetBalanceResult>;
/** Transfer sBTC (SIP-010) to another Stacks address. Amount in base units (8 decimals). */
export declare function sendSbtc(params: SendSbtcParams): Promise<BroadcastResult>;
/** Build an sBTC peg-in deposit address and metadata (no Bitcoin broadcast). */
export declare function sbtcBuildPegIn(params: SbtcBuildPegInParams): Promise<SbtcBuildPegInResult>;
/** Peg BTC in: build, sign, broadcast Bitcoin tx, and notify Emily. */
export declare function sbtcInitiatePegIn(params: SbtcInitiatePegInParams): Promise<SbtcInitiatePegInResult>;
/** Initiate sBTC peg-out (withdraw sBTC for BTC on L1). */
export declare function sbtcInitiatePegOut(params: SbtcInitiatePegOutParams): Promise<BroadcastResult>;
/** Poll Emily for peg-in deposit status or list withdrawals for a Stacks sender. */
export declare function sbtcGetPegStatus(params: SbtcGetPegStatusParams): Promise<SbtcGetPegStatusResult>;
