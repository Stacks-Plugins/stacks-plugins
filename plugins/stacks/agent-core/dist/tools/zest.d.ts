import { BroadcastResult, ZestBorrowParams, ZestCollateralAddSbtcParams, ZestPositionParams, ZestPositionResult, ZestProtocolStatusParams, ZestProtocolStatusResult, ZestRedeemSbtcParams, ZestRepayParams, ZestSbtcVaultInfoParams, ZestSbtcVaultInfoResult, ZestSupplySbtcParams } from '../types';
/** Read Zest sBTC vault utilization, interest rate, and liquidity. */
export declare function zestSbtcVaultInfo(params: ZestSbtcVaultInfoParams): Promise<ZestSbtcVaultInfoResult>;
/** Read Zest pause flags on the sBTC vault. */
export declare function zestProtocolStatus(params: ZestProtocolStatusParams): Promise<ZestProtocolStatusResult>;
/** Supply sBTC to Zest vault-sbtc and receive zsBTC shares. */
export declare function zestSupplySbtc(params: ZestSupplySbtcParams): Promise<BroadcastResult>;
/** Redeem zsBTC shares from Zest vault-sbtc for underlying sBTC. */
export declare function zestRedeemSbtc(params: ZestRedeemSbtcParams): Promise<BroadcastResult>;
/** Read a user's Zest market position (collateral and debt). */
export declare function zestPosition(params: ZestPositionParams): Promise<ZestPositionResult>;
/** Add sBTC as collateral on Zest market (for borrowing). */
export declare function zestCollateralAddSbtc(params: ZestCollateralAddSbtcParams): Promise<BroadcastResult>;
/** Borrow an asset from Zest market against posted collateral. */
export declare function zestBorrow(params: ZestBorrowParams): Promise<BroadcastResult>;
/** Repay borrowed debt on Zest market. */
export declare function zestRepay(params: ZestRepayParams): Promise<BroadcastResult>;
