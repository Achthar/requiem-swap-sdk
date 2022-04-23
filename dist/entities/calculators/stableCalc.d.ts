import { BigNumber } from 'ethers';
import { StableSwapStorage } from './stableSwapStorage';
export declare const A_PRECISION: BigNumber;
export declare function _xp(balances: BigNumber[], rates: BigNumber[]): BigNumber[];
export declare function _getAPrecise(blockTimestamp: BigNumber, swapStorage: StableSwapStorage): BigNumber;
export declare function _sumOf(x: BigNumber[]): BigNumber;
export declare function _distance(x: BigNumber, y: BigNumber): BigNumber;
/**
 * Calculate D for *NORMALIZED* balances of each tokens
 * @param xp normalized balances of token
 */
export declare function _getD(xp: BigNumber[], amp: BigNumber): BigNumber;
export declare function _getY(inIndex: number, outIndex: number, inBalance: BigNumber, blockTimestamp: BigNumber, swapStorage: StableSwapStorage, normalizedBalances: BigNumber[]): BigNumber;
export declare function calculateSwapGivenIn(inIndex: number, outIndex: number, inAmount: BigNumber, // standard fields
balances: BigNumber[], blockTimestamp: BigNumber, swapStorage: StableSwapStorage): BigNumber;
export declare function calculateSwapGivenOut(inIndex: number, outIndex: number, outAmount: BigNumber, // standard fields
balances: BigNumber[], blockTimestamp: BigNumber, swapStorage: StableSwapStorage): BigNumber;
export declare function _calculateRemoveLiquidity(amount: BigNumber, swapStorage: StableSwapStorage, totalSupply: BigNumber, currentWithdrawFee: BigNumber, balances: BigNumber[]): BigNumber[];
export declare function _calculateRemoveLiquidityOneToken(swapStorage: StableSwapStorage, tokenAmount: BigNumber, index: number, blockTimestamp: BigNumber, balances: BigNumber[], totalSupply: BigNumber, currentWithdrawFee: BigNumber): {
    [returnVal: string]: BigNumber;
};
/**
 * Estimate amount of LP token minted or burned at deposit or withdrawal
 * without taking fees into account
 */
export declare function _calculateTokenAmount(swapStorage: StableSwapStorage, amounts: BigNumber[], deposit: boolean, balances: BigNumber[], blockTimestamp: BigNumber, totalSupply: BigNumber): BigNumber;
